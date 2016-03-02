# node-thumb-service
A simple API to resize image from GET params with cache support. Rsize use aheckmann/gm

## Requirements
This API use [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/) so you need to install that for the correct resizing of image.

## Installation
First clone this project with:
    
    git clone git://github.com/mcatta/node-thumb-service.git

next you need to install dependecies with

    npm install

## Configuration
In the root of project there is config.js, inside that you will found parameters to set up temporary and cache folder.

```js
module.exports = {
  allowExternal : true,                         // allow to resize external folder
  localHostAllowed : [  
    'www.example.com'                           // list of local allowed host (need allowExternal false)
  ],
  outputFolder : '/var/www/example.com/output', // Output/cache folder
  tempFolder : '/var/www/example.com/temp'      // Temp folder
}
```

## Example
When you run the script the you can use this path to resize a picture:

    http://localhost:3031/resize/w400/h500/http:%2F%2Fwww.example.com%2Fmypic.jpg
    
