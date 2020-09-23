const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');


(async () => {
  const file = await imagemin( ['image/*.{jpg,png}'], {
      destination: 'build',
      plugins: [
        imageminWebp({quality: 60})
      ]
  })
  console.log(file);
})();

(async () => {
  const file = await imagemin( ['image/*.{jpg,png}'], {
      destination: 'build',
      plugins: [
        imageminPngquant({quality: [0.3, 0.5]}),
        //imageminJpegtran({quality: 60})
      ]
  })
  console.log(file);
})();