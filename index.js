var express = require('express'),
	http = require('http'),
	app = express(),
	config = require('./config');
	resize = require('./route/resize');

// GET /resize
app.route('/resize/w:width/h:height/:url')
	.get(resize.check)
	.get(resize.cache)
	.get(resize.execute);

// GET /resize without cache
app.route('/resize/w:width/h:height/:url/nocache')
	.get(resize.check)
	.get(resize.execute);

console.log('working on port ' + config.port + '...');
app.listen(config.port);
