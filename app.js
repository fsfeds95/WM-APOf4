const express = require('express');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8225;

app.use(express.json());

// Objeto para almacenar el caché de imágenes
const imageCache = {};

// Ruta "/p"
app.get('/p', async (req, res) => {
  const url = req.query.url;

  // Verificar si se suministró un enlace
  if (!url) {
    return res.status(400).json({ error: 'No se proporcionó un enlace' });
  }

  // Verificar si la imagen está en el caché
  if (imageCache[url]) {
    console.log(`Sirviendo imagen '${url}' desde el caché`);
    return res.header('Content-Type', 'image/webp').send(imageCache[url]);
  }

  console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/p'`);

  try {
    // Cargar la imagen desde el enlace
    const image = await Jimp.read(url);

    // Redimensionar la imagen a 720x1080
    image.resize(720, 1080);

    // Cargar las marcas de agua
    const watermark1 = await Jimp.read('Wtxt-poster.png');
    const watermark2 = await Jimp.read('Wlogo-poster.png');

    // Escala la marca de agua a 720px de ancho por 1080px de alto
    watermark1.resize(720, 1080);
    watermark2.resize(720, 1080);

    // Establece la opacidad de la watermark1 a 0.375 y watermark2 a 0.75
    watermark1.opacity(0.075);
    watermark2.opacity(0.40);

    // Combinar las marcas de agua en una sola imagen
    watermark1.composite(watermark2, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Aplicar la marca de agua a la imagen
    image.composite(watermark1, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Guardar la imagen en formato WebP con calidad al 100%
    const buffer = await image.quality(100).getBufferAsync(Jimp.MIME_WEBP);

    // Almacenar la imagen en el caché
    imageCache[url] = buffer;

    // Enviar la imagen como respuesta
    res.header('Content-Type', 'image/webp').send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

// Ruta "/b"
app.get('/b', async (req, res) => {
  const url = req.query.url;

  // Verificar si se suministró un enlace
  if (!url) {
    return res.status(400).json({ error: 'No se proporcionó un enlace' });
  }

  // Verificar si la imagen está en el caché
  if (imageCache[url]) {
    console.log(`Sirviendo imagen '${url}' desde el caché`);
    return res.header('Content-Type', 'image/webp').send(imageCache[url]);
  }

  console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/b'`);

  try {
    // Cargar la imagen desde el enlace
    const image = await Jimp.read(url);

    // Redimensionar la imagen a 1280x720
    image.resize(1280, 720);

    // Cargar las marcas de agua
    const watermark1 = await Jimp.read('Wtxt-Backdrop.png');
    const watermark2 = await Jimp.read('Wlogo-Backdrop.png');

    // Escala la marca de agua a 1280px de ancho por 720px de alto
    watermark1.resize(1280, 720);
    watermark2.resize(1280, 720);

    // Establece la opacidad de la watermark1 a 0.375 y watermark2 a 0.75
    watermark1.opacity(0.075);
    watermark2.opacity(0.40);

    // Combinar las marcas de agua en una sola imagen
    watermark1.composite(watermark2, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Aplicar la marca de agua a la imagen
    image.composite(watermark1, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Guardar la imagen en formato WebP con calidad al 100%
    const buffer = await image.quality(100).getBufferAsync(Jimp.MIME_WEBP);

    // Almacenar la imagen en el caché
    imageCache[url] = buffer;

    // Enviar la imagen como respuesta
    res.header('Content-Type', 'image/webp').send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

// Ruta "/bSeries"
app.get('/bSeries', async (req, res) => {
  const backdrop = req.query.backdrop;
  const poster = req.query.poster;

  // Verificar si se suministraron los enlaces
  if (!backdrop || !poster) {
    return res.status(400).json({ error: 'No se proporcionaron los enlaces de las imágenes' });
  }

  // Verificar si las imágenes están en el caché
  if (imageCache[backdrop] && imageCache[poster]) {
    console.log(`Sirviendo imágenes '${backdrop}' y '${poster}' desde el caché`);
    return res.header('Content-Type', 'image/webp').send(imageCache[backdrop]);
  }

  console.log(`Se solicitaron las siguientes imágenes: '${backdrop}' y '${poster}' en la ruta '/bSeries'`);

  try {
    // Cargar las imágenes desde los enlaces
    const background = await Jimp.read(backdrop);
    const foreground = await Jimp.read(poster);

    // Redimensionar la imagen de fondo a 1280x720 utilizando RESIZE_MAGPHASE
    background.resize(1280, 720, Jimp.RESIZE_MAGPHASE);

    // Redimensionar la imagen de primer plano (póster) a 480x720 utilizando RESIZE_MAGPHASE
    foreground.resize(480, 720, Jimp.RESIZE_MAGPHASE);

    // Centrar verticalmente la imagen de póster en el fondo
    const yPos = (720 - 720) / 2;

    // Dejar un espacio de 60 píxeles desde el borde izquierdo
    const xPos = 60;

    // Combinar las imágenes
    background.composite(foreground, xPos, yPos, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Cargar las marcas de agua
    const watermark1 = await Jimp.read('Wtxt-Backdrop.png');
    const watermark2 = await Jimp.read('Wlogo-Backdrop.png');

    // Escala la marca de agua a 1280px de ancho por 720px de alto
    watermark1.resize(1280, 720);
    watermark2.resize(1280, 720);

    // Establece la opacidad de la watermark1 a 0.375 y watermark2 a 0.75
    watermark1.opacity(0.075);
    watermark2.opacity(0.40);

    // Combinar las marcas de agua en una sola imagen
    watermark1.composite(watermark2, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Aplicar la marca de agua a la imagen final
    background.composite(watermark1, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Guardar la imagen combinada en formato WebP con calidad al 100%
    const buffer = await background.quality(100).getBufferAsync(Jimp.MIME_WEBP);

    // Almacenar las imágenes en el caché
    imageCache[backdrop] = buffer;
    imageCache[poster] = buffer;

    // Enviar la imagen como respuesta
    res.header('Content-Type', 'image/webp').send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar las imágenes' });
  }
});

// Ruta "/keep-alive"
app.get('/keep-alive', (req, res) => {
  res.send('');
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);

  setInterval(() => {
    fetch(`http://localhost:${port}/keep-alive`)
      .then(response => {
        console.log('Sigo vivo 🎉');
      })
      .catch(error => {
        console.error('Error en la solicitud de keep-alive:', error);
      });
  }, 5 * 60 * 1000);
});