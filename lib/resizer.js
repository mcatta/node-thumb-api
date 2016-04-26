var fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    url = require('url'),
    cache = require('./cache'),
    facer = require('./facer'),
    http = require('http'),
    sizeOf = require('image-size'),
    config = require('../config');

module.exports = {

  /**
   * Download file in local
   * @param  {String}   req_url  http url
   * @param  {Function} callback
   */
  downloadImage: function(req_url, callback) {

    /**
     * Filename
     */
    var fileName = url.parse(req_url).path.split('/');
    fileName = fileName[fileName.length-1];
    var file = fs.createWriteStream(config.tempFolder + '/' + fileName);

    /**
     * Wget
     */
    var request = http.get(req_url, function(response) {

      // Copying...
      response.pipe(file);

      // On copy ending
      response.on('end', function() {

        callback(response.statusCode == 200, file.path);

      });

    });

  },

  /**
   * Resize image
   * @param  {String}   path               local path
   * @param  {Function} callback
   * @param  {Boolean}   removeAfterProcess remove at the end of process
   */
  resize: function(params, callback, removeAfterProcess) {

    /**
     * Params
     */
    var width = params.width;
    var height = params.height;
    var url_req = params.url;
    var path = params.path;
    var resizemode = params.resizemode;

    /**
     * Filename
     */
    var fileName = url.parse(path).path.split('/');
    fileName = fileName[fileName.length-1];

    /**
     * Check size
     */
    var dimensions = sizeOf(path);
    var originalRatio = dimensions.width / dimensions.height;
    var newRatio = width / height;

    var max = Math.max(width, height)

    var h = 0;
    var w = 0;

    var filename = cache.generateFilename({ width: width, height: height, url: url_req, resizemode: resizemode});

    /**
     * Resize with gm
     */
    switch (resizemode) {
      /**
       * Cover, scale and crop picture
       */
      case 'cover':

        /**
         * Ratio > 1 horizontal else vertical
         */
        if (originalRatio != newRatio) {

          if (originalRatio > 1) {
            h = max;
            w = (dimensions.width * h) / dimensions.height;
          } else {
            w = max;
            h = (w * dimensions.height) / dimensions.width;
          }

        }

        /**
         * Resize
         */
        gm(path)
          .resize(w, h)
          .crop(width, height, (w-width) / 2, (h-height) / 2)
          .noProfile()
          .write(config.outputFolder + '/' + filename, function (err) {

            if (err) {
              console.log(err);
              callback.error(err);
            } else {
              // Remove temp file
              if (removeAfterProcess)
                fs.unlinkSync(path);
              callback.success(config.outputFolder + '/' + filename);
            }

          });
        break;

      /**
       * Crop picture without scaling
       */
      case 'crop':

        w = dimensions.width;
        h = dimensions.height;

        /**
         * Resize
         */
        gm(path)
          .crop(width, height, (w-width) / 2, (h-height) / 2)
          .noProfile()
          .write(config.outputFolder + '/' + filename, function (err) {

            if (err) {
              console.log(err);
              callback.error(err);
            } else {
              // Remove temp file
              if (removeAfterProcess)
                fs.unlinkSync(path);
              callback.success(config.outputFolder + '/' + filename);
            }

          });
        break;

      case 'contain':
        /**
         * Resize
         */
        gm(path)
          .resize(width, height)
          .noProfile()
          .write(config.outputFolder + '/' + filename, function (err) {

            if (err) {
              console.log(err);
              callback.error(err);
            } else {
              // Remove temp file
              if (removeAfterProcess)
                fs.unlinkSync(path);
              callback.success(config.outputFolder + '/' + filename);
            }

          });
        break;

      case 'facer':
        facer.getLimits(path, function(limits) {

          w = limits.right - limits.left;
          h = limits.bottom - limits.top;

          /**
           * Resize
           */
          gm(path)
            .crop(w, h, limits.left, limits.top)
            //.resize(width, height)
            .noProfile()
            .write(config.outputFolder + '/' + filename, function (err) {

              if (err) {
                console.log(err);
                callback.error(err);
              } else {
                // Remove temp file
                if (removeAfterProcess)
                  fs.unlinkSync(path);
                callback.success(config.outputFolder + '/' + filename);
              }

            });

        });
        break;

      default:
        callback.error(500);
        break;

    }

  },

  /**
   * Request resize
   * @param  {Object}   params   params, url width height...
   * @param  {Function} callback
   */
  requestResize: function(params, callback) {

    /**
     * Params
     */
    var req_url = params.url;
    var source_url = params.source_url;
    var width = params.width;
    var height = params.height;
    var resizemode = params.resizemode;

    console.log('Resize request: ' + width + ' ' + height + ' : ' + req_url + ' mode: ' + resizemode);

    /**
     * Remote url
     */
    if (source_url.indexOf('http://') >= 0 || source_url.indexOf('https://') >= 0) {
      module.exports.downloadImage(req_url, function(result, path) {

        if (result) {
          module.exports.resize({ width : width, height : height, path : path , url : req_url, resizemode: resizemode }, callback, true);
        } else {
          callback.error(404);
        }

      });

    }
    /**
     * Local url
     */
    else {

      // req_url is local path
      module.exports.resize({ width : width, height : height, path : source_url, url : req_url, resizemode: resizemode }, callback, false);

    }

  }

}
