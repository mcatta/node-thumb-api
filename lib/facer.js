var cv = require('opencv');

module.exports = {

  /**
   * Return an limited area with faces
   * @param  {[type]}   path     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  getLimits : function(path, callback) {

    cv.readImage(path, function(err, im) {

      im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){

        var limits = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };

        console.log(faces);
        for (var i = 0; i<faces.length; i++) {

          var face = faces[i];
          if (i == 0) {
            limits.top = face.y;
            limits.right = face.x + face.width;
            limits.bottom = face.y + face.height;
            limits.left = face.x;
          } else {
            limits.top = Math.min(limits.top, face.y);
            limits.right = Math.max(limits.right, (face.x + face.width));
            limits.bottom = Math.max(limits.bottom, (face.y + face.height));
            limits.left = Math.min(limits.left, face.x);
          }

        }

        console.log(limits);
        callback(limits);
      });

    })

  }

}
