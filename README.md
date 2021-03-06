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

    http://localhost:3031/resize/w400/h500/http:%2F%2Fwww.example.com%2Fmypic.jpg/?blur=90 (90% for example)

These params are combinables

    http://localhost:3031/resize/w400/h500/http:%2F%2Fwww.example.com%2Fmypic.jpg/?blur=90&nocache=1
  
  
  
## LICENSE

> Copyright 2016 Marco Cattaneo

> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at

>    http://www.apache.org/licenses/LICENSE-2.0

> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.
