var express = require('express'),
	  router = new express.Router(),
		resize = require('../modules/resize'),
		cache9 = require('../modules/cache'),
		config = require('../config.js');

/**
 * Resize picture by params
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
router.execute = function(req, res, next) {

	/**
	 * params
	 */
	var width = req.params.width;
  var height = req.params.height;
  var url = req.params.url;

	if (width && height && url) {

		resize.resizePic(width, height, url, {
			success: function(filePath) {

				var options = {
				  root: config.root,
				  dotfiles: 'deny',
				  headers: {
				      'x-timestamp': Date.now(),
				      'x-sent': true
				  }
				};

				res.sendFile(filePath, options, function (err) {
			    if (err) {
			      console.log(err);
			      res.status(err.status).end();
			    }
			    else {
			      console.log('Sent:', filePath);
			    }
			  });

			},
			error: function(err) {
				res.status(505);
			}
		});

  } else {

    res.status(403);

  }

},

/**
 * Check if url is allowed
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
router.check = function(req, res, next) {

	var url = req.params.url;

	resize.checkFileUrl(url, function(errCode) {

		if (errCode)
			res.status(errorCode);
		else
			next();

	});

},

router.cache = function(req, res, next) {

}

module.exports = router;
