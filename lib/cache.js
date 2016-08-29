var fs = require('fs'),
    config = require('../config.js'),
    crypto = require('crypto'),
	  md5sum = crypto.createHash('md5'),
    url = require('url');

module.exports = {

  /**
   * Check if file is cached
   * @param  {[type]}   params   [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  checkCachedFile: function(params, callback) {

    var imageFile = config.outputFolder + '/' + module.exports.generateFilename(params);
    fs.exists(imageFile, function(exists) {
      callback(exists, imageFile);
    });

  },

  /**
   * Generate file name
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  generateFilename : function(params) {
    var ext = params.url.split('.');
    ext = ext[ext.length-1];
    var hash = crypto.createHash('md5').update(params.width + params.height + params.url + params.resizemode + JSON.stringify(params.query)).digest('hex');

    return hash + '.' + ext;
  }

}
