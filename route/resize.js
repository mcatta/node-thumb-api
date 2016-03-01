var express = require('express'),
	  router = new express.Router(),
		resize = require('../modules/resize'),
		cache = require('../modules/cache'),
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
  var url = res.locals.url;

	console.log('GET params: ' + width + ' ' + height + ' ' + url);

	if (width && height && url) {

		resize.resizePic(width, height, url, {
			success: function(filePath) {

				/*
 				 * Return resized file
				 */
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

	resize.checkFileUrl(url, function(errCode, newPath) {

		if (errCode)
			res.sendStatus(errCode);
		else {
			res.locals.url = newPath;
			next();
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

				/*
 				 *
				 */
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
					res.sendStatus(err.status).end();
				}
				else {
					console.log('Sent:', filePath);
				}
			});

		} else {
			// Continue resizing...
			next();
		}

	});

}

module.exports = router;
