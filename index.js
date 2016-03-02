var express = require('express'),
	http = require('http'),
	app = express();

var resize = require('./route/resize');

/*
 * 1. analizzo la risorsa per verificare se è valida e restituisco la url - formattata
 * 2. data la url riformattata, verifico cache
 * 3. pre-check di resize, verifico se fonte locale o fonte remota
 * 3.1. fonte remota download
 * 4. faccio resize applicativo
 */

/*
 * docker run -i -t -v /Users/marcocattaneo/node/node-thumb-service:/home -p 3031:3031 450650e38b02 ./bin/bash
 *
 * http://192.168.99.100:3031/resize/w400/h400/http:%2F%2Fwww.chiharubatolecrostate.com%2Fwp-content%2Fuploads%2F2016%2F02%2FDSC_1673-678x1024.jpg
 */

// GET /resize
app.route('/resize/w:width/h:height/:url')
	.get(resize.check)
	.get(resize.cache)
	.get(resize.execute);

console.log('working on port 3031...');
app.listen(3031);
