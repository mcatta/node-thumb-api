var fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    http = require('http'),
    url = require('url'),
    cache = require('./cache.js'),
    sizeOf = require('image-size'),
    config = require('../config.js');

module.exports = {

  /**
   * Check url before execution
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  checkFileUrl : function(reqUrl, callback) {

    /*
     * If external host file are allowed
     */
    if (config.allowExternal) {

      module.exports.checkRemoteFile(reqUrl, function(exists) {

        if (exists)
          callback(undefined, reqUrl);
        else
          callback(404);

      });

    } else {

      if (config.localHostAllowed.indexOf(url.parse(reqUrl).host) > 0) {

        /*
         * Host allowed, check if local file exists
         */
        var reqUrl = reqUrl.replace('http://www.', '/var/www/');
        fs.exists(reqUrl, function(exists) {
           callback(exists ? undefined : 200, reqUrl);
        });

      } else {

        /*
         * Permission denied
         */
        callback(403);

      }

    }

  },

  /**
   * Check if external file exists
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  checkRemoteFile: function(reqUrl, callback) {
    var options = {
        method: 'HEAD',
        host: url.parse(reqUrl).host,
        port: 80,
        path: url.parse(reqUrl).pathname
    };

    var req = http.request(options, function (r) {

      // exists
      callback(r.statusCode == 200)

    });
    req.end();
  },

  /**
   * Resize picture
   * @param  {[type]}   width    [description]
   * @param  {[type]}   height   [description]
   * @param  {[type]}   url      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  resizePic : function(width, height, reqUrl, callback) {

    /*
     * Filename
     */
    var fileName = url.parse(reqUrl).path.split('/');
    var fileName = fileName[fileName.length-1];
    var file = fs.createWriteStream(config.tempFolder + '/' + fileName);

    var request = http.get(reqUrl, function(response) {

      // Copying...
      response.pipe(file);

      // On copy ending
      response.on('end', function() {

        /*
         * Check size
         */
        var dimensions = sizeOf(file.path);
        var originalRatio = dimensions.width / dimensions.height;
        var newRatio = width / height;

        var max = Math.max(width, height)

        var h = 0;
        var w = 0;
        /*
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
        console.log("Request size: " + width + " " + height);
        console.log("Resize without crop: " + w + " " + h);

        var outputFilename = cache.generateFilename({ width: width, height: height, url: reqUrl});
        /*
         * Resize
         */
        gm(config.tempFolder + '/' + fileName)
          .resize(w, h)
          .crop(width, height, (w-width) / 2, (h-height) / 2)
          .noProfile()
          .write(config.outputFolder + '/' + outputFilename, function (err) {

            if (err) {
              callback.error(err);
            } else {
              // Remove temp file
              fs.unlinkSync(config.tempFolder + '/' + fileName);
              callback.success(config.outputFolder + '/' + outputFilename);
            }

          });

      });

    });

  }

}
