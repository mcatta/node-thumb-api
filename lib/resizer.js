var fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    url = require('url'),
    cache = require('./cache'),
    http = require('http'),
    sizeOf = require('image-size');

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
    var file = fs.createWriteStream(tempFolder + '/' + fileName);

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
    var blurmode = params.query.blur == 1;

    /**
     * Filename
     */
    var fileName = url.parse(path).path.split('/');
    fileName = fileName[fileName.length-1];

    /**
     * Check size
     */
    var dimensions = sizeOf(path),
        originalRatio = dimensions.width / dimensions.height,
        newRatio = width / height,

        max = Math.max(width, height),

        h = 0,
        w = 0;

    var filename = cache.generateFilename({ width: width, height: height, url: url_req, resizemode: resizemode, query: params.query});

    var gmPic = gm(path);

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

          if (newRatio < 1) {
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
        gmPic.resize(w, h)
          .crop(width, height, (w-width) / 2, (h-height) / 2);
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
        gmPic.crop(width, height, (w-width) / 2, (h-height) / 2);

        break;

      case 'contain':
        /**
         * Resize
         */
        gmPic.resize(width, height);
        break;

      default:
        // Nothing
        break;

    }

    // Use blur if enabled
    if (blurmode == true)
      gmPic.blur(90, 90);

    // Create new picture
    gmPic.noProfile()
      .write(global.outputFolder + '/' + filename, function (err) {

        if (err) {
          console.log(err);
          callback.error(err);
        } else {
          // Remove temp file
          if (removeAfterProcess)
            fs.unlinkSync(path);
          callback.success(global.outputFolder + '/' + filename);
        }

      });

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
          module.exports.resize({ width : width, height : height, path : path , url : req_url, resizemode: resizemode, query: params.query }, callback, true);
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
