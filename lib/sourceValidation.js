var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    config = require('../config');

module.exports = {

  /**
   * Verify if path is allowed and exists
   * @param  {[type]}   url_req  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  verifySource: function(url_req, callback) {

    if (config.allowExternal) {

      module.exports.verifyRemote(url_req, function(exists, url_req) {

        callback(exists, url_req);

      });

    } else {

      /*
       * Check if host is allowed by hostname
       */
       var allowed = false;
       for (var i = 0; i <config.localHostAllowed.length; i++)
        allowed |= ((url.parse(url_req).host).match(config.localHostAllowed[i]) != null)

      /*
       * If allowed
       */
      if (allowed) {

        module.exports.verifyLocal(url_req, function(exists, url_req) {

          callback(exists, url_req);

        });

      } else {

        /*
         * Permission denied
         */
        callback(false, url_req);

      }

    }
  },

  /**
   * Verify remotly if file exsists
   * @param  {[type]}   url_req  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  verifyRemote: function(url_req, callback) {

    var options = {
        method: 'HEAD',
        host: url.parse(url_req).host,
        port: 80,
        path: url.parse(url_req).pathname
    };

    var req = http.request(options, function (r) {

      // exists
      callback(r.statusCode == 200, url_req)

    });
    req.end();

  },

  /**
   * Verify if file exsists locally, and rewrite path
   * @param  {[type]}   url_req  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  verifyLocal: function(url_req, callback) {

    /*
     * Host allowed, check if local file exists
     */
    url_req = url_req.replace('http://www.', '/var/www/');
    fs.exists(url_req, function(exists) {
       callback(exists, url_req);
    });

  }

}
