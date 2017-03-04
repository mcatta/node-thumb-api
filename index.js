/**
 * ##### CONFIGURATION #####
 */
global.port = 3031,
global.cache = false;

global.allowExternal = true,
global.localHostAllowed = [
	'www.example.com'
],
global.outputFolder = '/Users/marcocattaneo/node/node-thumb-service/output',
global.tempFolder = '/Users/marcocattaneo/node/node-thumb-service/temp';
/*
 * #########################
 */

var express = require('express'),
	http = require('http'),
	app = express(),
	resize = require('./route/resizeRoute');

// GET /resize
app.route('/resize/:resizemode?/w:width/h:height/:url/:params?')
	.get(resize.check)
	.get(resize.cache)
	.get(resize.execute);

console.log('working on port ' + global.port + '...');
app.listen(global.port);
