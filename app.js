const express = require('express');
const Jimp = require('jimp');
const app = express();

// Middleware para procesar datos JSON
app.use(express.json());

// Ruta "/p"
app.get('/p', async (req, res) => {
  const url = req.query.url;

  // Verificar si se suministró un enlace
  if (!url) {
    return res.status(400).json({ error: 'No se proporcionó un enlace' });
  }

  try {
    // Cargar la imagen desde el enlace
    const image = await Jimp.read(url);

    // Redimensionar la imagen a 720x1080
    image.resize(720, 1080);

    // Cargar la marca de agua
    const watermark = await Jimp.read('wm-poster_v2.png');
    watermark.resize(720, 1080);

    // Aplicar la marca de agua a la imagen
    image.composite(watermark, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.25,
    });

    // Guardar la imagen en formato JPEG con calidad al 95%
    image.quality(95).write('p.bin');

    // Enviar la imagen como respuesta
    image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
      if (err) {
        return res.status(500).json({ error: 'Error al generar la imagen' });
      }
      res.header('Content-Type', 'image/jpeg');
      res.send(buffer);
    });
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

  try {
    // Cargar la imagen desde el enlace
    const image = await Jimp.read(url);

    // Redimensionar la imagen a 1280x720
    image.resize(1280, 720);

    // Cargar las marcas de agua
    const watermark1 = await Jimp.read('Wtxt-Backdrop.png');
    const watermark2 = await Jimp.read('Wlogo-Backdrop.png');
    watermark1.resize(1280, 720);
    watermark2.resize(1280, 720);
    watermark1.opacity(0.25);
    watermark2.opacity(1);

    // Combinar las marcas de agua en una sola imagen
    watermark1.composite(watermark2, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
    });

    // Aplicar la marca de agua a la imagen
    image.composite(watermark1, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
    });

    // Guardar la imagen en formato JPEG con calidad al 95%
    image.quality(95).write('b.bin');

    // Enviar la imagen como respuesta
    image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
      if (err) {
        return res.status(500).json({ error: 'Error al generar la imagen' });
      }
      res.header('Content-Type', 'image/jpeg');
      res.send(buffer);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

// Iniciar el servidor en el puerto 8225
app.listen(8225, () => {
  console.log('Servidor iniciado en http://localhost:8225');
});