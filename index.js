var express = require('express'),
	http = require('http'),
	app = express(),
	config = require('./config');
	resize = require('./route/resizeRoute');

// GET /resize
app.route('/resize/:resizemode?/w:width/h:height/:url/:params?')
	.get(resize.check)
	.get(resize.cache)
	.get(resize.execute);

console.log('working on port ' + config.port + '...');
app.listen(config.port);
