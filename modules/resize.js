var fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    http = require('http'),
    url = require('url'),
    config = require('../config.js');

module.exports = {

  /**
   * Check url before execution
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  checkFileUrl : function(reqUrl, callback) {

     var options = {
         method: 'HEAD',
         host: url.parse(reqUrl).host,
         port: 80,
         path: url.parse(reqUrl).pathname
     };

     var req = http.request(options, function (r) {

       // exists
       if (r.statusCode == 200) {

         /*
          * Verify url
          */
         if (config.freeUse) {
           callback();

         } else {

            // Check if allowed
            if (config.localHostAllowed.indexOf(url.parse(reqUrl).host) > 0) {
              callback();
            } else {
              callback(403);
            }

         }

       } else {
         // not exists
         callback(r.statusCode);
       }

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

    var fileName = url.parse(reqUrl).path.split('/');
    var fileName = fileName[fileName.length-1];
    var file = fs.createWriteStream('temp/' + fileName);

    var request = http.get(reqUrl, function(response) {

      // Copying...
      response.pipe(file);

      // On copy ending
      response.on('end', function() {

        /*
         * Resize
         */
        gm('temp/' + fileName)
          .resize(width, height)
          .crop(width, height, 0, 0)
          .noProfile()
          .write('output/' + fileName, function (err) {

            if (err) {
              callback.error(err);
            } else {
              callback.success('output/' + fileName);
            }

          });

      });

    });

  }

}
