var express = require('express'),
	  router = new express.Router(),
		check = require('../lib/sourceValidation'),
		resizer = require('../lib/resizer'),
		cache = require('../lib/cache'),
		config = require('../config');

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
  var source_url = res.locals.url;

	if (width && height && url) {

		resizer.requestResize({width : width, height : height, source_url : source_url, url : url}, {
			success: function(filePath) {

				/*
 				 * Return resized file
				 */
				var options = {
				  dotfiles: 'deny',
				  headers: {
				      'x-timestamp': Date.now(),
				      'x-sent': true
				  }
				};

				res.sendFile(filePath, options, function (err) {
			    if (err) {
			      res.sendStatus(err.status).end();
			    }
			    else {
			      console.log('Sent:', filePath);
			    }
			  });

			},
			error: function(err) {

				/*
  		   * On resize error
				 */
				res.sendStatus(505);
			}
		});

  } else {

		/*
     * Miss params
		 */
    res.sendStatus(505);

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

	check.verifySource(url, function(exists, newPath) {

		if (exists) {
			res.locals.url = newPath;
			next();
		} else {
			res.sendStatus(404);
		}

	});

},

/**
 * Cache function, if file already exists return it, else resize new file
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
router.cache = function(req, res, next) {

	cache.checkCachedFile({
		width: req.params.width,
		height: req.params.height,
		url: req.params.url
	}, function(exists, filePath) {

		/**
		 * File exsists
		 */
		if (exists) {
			var options = {
				dotfiles: 'deny',
				headers: {
						'x-timestamp': Date.now(),
						'x-sent': true
				}
			};

			res.sendFile(filePath, options, function (err) {
				if (err) {
					console.log(err);
					res.sendStatus(err.status).end();
				}
				else {
					console.log('Sent cached: ' + filePath);
				}
			});

		} else {
			// Continue resizing...
			next();
		}

	});

}

module.exports = router;
