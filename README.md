# node-thumb-api
A simple API to resize image from GET params with cache support. Resize use [aheckmann/gm](https://github.com/aheckmann/gm)

## Requirements
This API use [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/) so you need to install that for the correct resizing of image.

## Installation
First clone this project with:

    git clone git://github.com/mcatta/node-thumb-service.git

next you need to install dependecies with

    npm install

## Configuration
In the root of project there is index.js, on the top there are configuration params.

```js
global.port = 3031,                                   // Service port
global.cache = false;                                 // cache on/off

global.allowExternal = true,                          // allow to resize external folder
global.localHostAllowed = [                           // list of local allowed host (need allowExternal false)
  'www.example.com'
],
global.outputFolder = '/var/www/example.com/output',  // Output/cache folder
global.tempFolder = '/var/www/example.com/temp';      // Temp folder
```

## Example
When you run the script the you can use this path to resize a picture:

    http://localhost:3031/resize/w400/h500/http:%2F%2Fwww.example.com%2Fmypic.jpg

## Resize formats:
You can also change resize-mode by get values: crop, contain, cover

![alt tag](https://raw.githubusercontent.com/mcatta/node-thumb-api/master/resizemode.jpg)

## Extra params
There some extra params for you resizing:

To force resizing without cache:

    http://localhost:3031/resize/w400/h500/http:%2F%2Fwww.example.com%2Fmypic.jpg/?nocache=1

Add blur filter

    http://localhost:3031/resize/w400/h500/http:%2F%2Fwww.example.com%2Fmypic.jpg/?blur=1

These params are combinables

    http://localhost:3031/resize/w400/h500/http:%2F%2Fwww.example.com%2Fmypic.jpg/?blur=1&nocache=1