// Importar las bibliotecas necesarias
const express = require('express');
const app = express();
const jimp = require('jimp');
const sharp = require('sharp');

// Escuchar en el puerto 8225
app.listen(8225, () => {
  console.log('La aplicación está escuchando en el puerto 8225.');
});

// Ruta "/backdrop" para escalar y añadir marca de agua a la imagen
app.get('/backdrop', async (req, res) => {
  // Verificar si se proporcionó un enlace
  if (!req.query.link) {
    return res.send('¡Advertencia! No se proporcionó un enlace.');
  }

  try {
    // Escalar la imagen a 1280x720
    const image = await sharp(req.query.link).resize(1280, 720).toBuffer();

    // Añadir marca de agua
    const watermark = await jimp.read('wm-backdrop.png');
    const watermarkedImage = await jimp.read(image);
    watermarkedImage.composite(watermark.opacity(0.6), 0, 0, {
      mode: jimp.BLEND_SCREEN,
      opacityDest: 1,
      opacitySource: 0.6
    });

    // Guardar la imagen con marca de agua como un archivo JPEG con calidad del 90%
    const outputImage = await watermarkedImage.quality(90).getBufferAsync(jimp.MIME_JPEG);

    // Mostrar la imagen en el navegador
    res.set('Content-Type', 'image/jpeg');
    res.send(outputImage);
  } catch (error) {
    console.error(error);
    res.send('Ocurrió un error al procesar la imagen.');
  }
});

// Ruta "/poster" para escalar y añadir marca de agua a la imagen
app.get('/poster', async (req, res) => {
  // Verificar si se proporcionó un enlace
  if (!req.query.link) {
    return res.send('¡Advertencia! No se proporcionó un enlace.');
  }

  try {
    // Escalar la imagen a 720x1280
    const image = await sharp(req.query.link).resize(720, 1280).toBuffer();

    // Añadir marca de agua
    const watermark = await jimp.read('wm-poster.png');
    const watermarkedImage = await jimp.read(image);
    watermarkedImage.composite(watermark.opacity(0.6), 0, 0, {
      mode: jimp.BLEND_SCREEN,
      opacityDest: 1,
      opacitySource: 0.6
    });

    // Guardar la imagen con marca de agua como un archivo JPEG con calidad del 90%
    const outputImage = await watermarkedImage.quality(90).getBufferAsync(jimp.MIME_JPEG);

    // Mostrar la imagen en el navegador
    res.set('Content-Type', 'image/jpeg');
    res.send(outputImage);
  } catch (error) {
    console.error(error);
    res.send('Ocurrió un error al procesar la imagen.');
  }
});
