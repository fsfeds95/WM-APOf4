const express = require('express');
const jimp = require('jimp');
const path = require('path');

const app = express();
const PORT = 8225;

// Middleware para permitir el análisis de JSON en las peticiones
app.use(express.json());

// Ruta "/p" para procesar la imagen con marca de agua y escalarla a 720x1080
app.get('/p', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('¡Error! No se proporcionó un enlace válido.');
  }

  try {
    const image = await jimp.read(url);
    const watermark = await jimp.read('wm-poster_v2.png');

    // Escalado de la imagen a 720x1080
    image.resize(720, 1080);

    // Agregar marca de agua con opacidad de 0.25
    image.composite(watermark, 0, 0, { mode: jimp.BLEND_SCREEN, opacitySource: 0.25 });

    // Guardar la imagen de salida
    const outputPath = path.join(__dirname, 'poster_WM_AstroPeliculasOf.jpg');
    await image.quality(95).writeAsync(outputPath);

    // Descargar la imagen en el navegador
    res.download(outputPath, 'WM-AstroPeliculasOf.jpg');
  } catch (error) {
    console.error(error);
    res.status(500).send('¡Error! No se pudo procesar la imagen.');
  }
});

// Ruta "/b" para procesar la imagen con marca de agua y escalarla a 1280x720
app.get('/b', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('¡Error! No se proporcionó un enlace válido.');
  }

  try {
    const image = await jimp.read(url);
    const watermark1 = await jimp.read('Wtxt-Backdrop.png');
    const watermark2 = await jimp.read('Wlogo-Backdrop.png');

    // Escalado de la imagen a 1280x720
    image.resize(1280, 720);
    
    watermark1.resize(1280, 720);
    watermark2.resize(1280, 720);

    // Agregar marcas de agua con opacidad de 1
    image.composite(watermark1, 0, 0, { mode: jimp.BLEND_SCREEN, opacitySource: 1 });
    image.composite(watermark2, 0, 0, { mode: jimp.BLEND_SCREEN, opacitySource: 1 });

    // Guardar la imagen de salida
    const outputPath = path.join(__dirname, 'backdrop_WM_AstroPeliculasOf.jpg');
    await image.quality(95).writeAsync(outputPath);

    // Descargar la imagen en el navegador
    res.download(outputPath, 'WM-AstroPeliculasOf.jpg');
  } catch (error) {
    console.error(error);
    res.status(500).send('¡Error! No se pudo procesar la imagen.');
  }
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});