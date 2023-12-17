// Paso 1: Importar las bibliotecas necesarias
const express = require('express');
const Jimp = require('jimp');

// Paso 2: Crear una nueva instancia de la aplicación Express
const app = express();

//---------------------------------
//----- ACA COMIENZA BACKDROP -----
//---------------------------------

// Paso 3: Definir la ruta /backdrop que escuchará las peticiones
app.get('/backdrop', async (req, res) => {
  // Paso 4: Obtener el enlace de la imagen suministrada
  const imageUrlBackdrop = req.query.img;

  // Paso 5: Verificar si se suministró un enlace
  if (!imageUrlBackdrop) {
    return res.send('¡Advertencia! Por favor, suministra un enlace de imagen.');
  }

  try {
    // Paso 6: Cargar la imagen desde el enlace
    const imageBackdrop = await Jimp.read(imageUrlBackdrop);

    // Paso 7: Escalar la imagen a 1280x720
    imageBackdrop.scaleToFit(1280, 720);

    // Paso 8: Cargar la marca de agua
    const watermarkBackdrop = await Jimp.read('wm-backdrop.png');

    // Paso 9: Aplicar la marca de agua a la imagen
    imageBackdrop.composite(watermarkBackdrop, 0, 0, {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 0.75
    });

    // Paso 10: Ajustar la calidad de la imagen de salida al 100%
    imageBackdrop.quality(100);

    // Paso 11: Guardar la imagen de salida con el nombre "WM_AstroPeliculas.jpg"
    const outputFileNameBackdrop = 'WM_AstroPeliculas.jpg';
    await imageBackdrop.writeAsync(outputFileNameBackdrop);

    // Paso 12: Enviar la imagen al navegador
    res.set('Content-Type', Jimp.MIME_JPEG);
    res.sendFile(outputFileNameBackdrop, { root: __dirname });
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al procesar la imagen.');
  }
});

//--------------------------------
//----- ACA COMIENZA POSTERS -----
//--------------------------------

// Paso 3: Definir la ruta /poster que escuchará las peticiones
app.get('/poster', async (req, res) => {
  // Paso 4: Obtener el enlace de la imagen suministrada
  const imageUrlPoster = req.query.img;

  // Paso 5: Verificar si se suministró un enlace
  if (!imageUrlPoster) {
    return res.send('¡Advertencia! Por favor, suministra un enlace de imagen.');
  }

  try {
    // Paso 6: Cargar la imagen desde el enlace
    const imagePoster = await Jimp.read(imageUrlPoster);

    // Paso 7: Escalar la imagen a 1280x720
    imagePoster.scaleToFit(1280, 720);

    // Paso 8: Cargar la marca de agua
    const watermarkPoster = await Jimp.read('wm-poster.png');

    // Paso 9: Aplicar la marca de agua a la imagen
    imagePoster.composite(watermarkPoster, 0, 0, {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 0.75
    });

    // Paso 10: Ajustar la calidad de la imagePostern de salida al 100%
    imagePoster.quality(100);

    // Paso 11: Guardar la imagen de salida con el nombre "WM_AstroPeliculas.jpg"
    const outputFileNamePoster = 'WM_AstroPeliculas.jpg';
    await imagePoster.writeAsync(outputFileNamePoster);

    // Paso 12: Enviar la imagen al navegador
    res.set('Content-Type', Jimp.MIME_JPEG);
    res.sendFile(outputFileNamePoster, { root: __dirname });
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al procesar la imagen.');
  }
});



// Paso 13: Escuchar en el puerto 8225
app.listen(8225, () => {
  console.log('La aplicación está escuchando en el puerto 8225.');
});
