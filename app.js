// Importar las bibliotecas requeridas
const express = require('express');
const jimp = require('jimp');
const sharp = require('sharp');

// Crea una aplicación en Express
const app = express();
const port = 8225;

// Middleware para procesar datos JSON
app.use(express.json());

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/p?url=IMG"
app.get('/p', async (req, res) => {
 const url = req.query.url;

 // Verificar si se suministró un enlace
 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 // Agrega este console.log
 console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/p'`);

 try {
  // Cargar la imagen desde el enlace
  const image = await jimp.read(url);

  // Redimensionar la imagen a 720x1080
  image.resize(720, 1080);

  // Cargar las marcas de agua
  const watermark1 = await jimp.read('Wtxt-poster.png');
  const watermark2 = await jimp.read('Wlogo-poster.png');

  // Escala la marca de agua a 1280px de ancho por 720px de alto
  watermark1.resize(720, 1080);
  watermark2.resize(720, 1080);

  // Establece la opacidad de la watermark1 a 0.375 y watermark2 a 0.75
  watermark1.opacity(0.08);
  watermark2.opacity(0.40);

  // Combinar las marcas de agua en una sola imagen
  watermark1.composite(watermark2, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  // Aplicar la marca de agua a la imagen
  image.composite(watermark1, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  // Guardar la imagen en formato JPEG con calidad al 100%
  image.quality(100).scale(1.5).write('p.bin');

  // Enviar la imagen como respuesta
  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header(
    'Content-Type', 'image/jpeg'
   );
   res.send(buffer);
  });
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/b?url=IMG"
app.get('/b', async (req, res) => {
 const url = req.query.url;

 // Verificar si se suministró un enlace
 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 // Agrega este console.log
 console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/b'`);

 try {
  // Cargar la imagen desde el enlace
  const image = await jimp.read(url);

  // Redimensionar la imagen a 1280x720
  image.resize(1280, 720);

  // Cargar las marcas de agua
  const watermark1 = await jimp.read('Wtxt-Backdrop.png');
  const watermark2 = await jimp.read('Wlogo-Backdrop.png');

  // Escala la marca de agua a 1280px de ancho por 720px de alto
  watermark1.resize(1280, 720);
  watermark2.resize(1280, 720);

  // Establece la opacidad de la watermark1 a 0.375 y watermark2 a 0.75
  watermark1.opacity(0.08);
  watermark2.opacity(0.40);

  // Combinar las marcas de agua en una sola imagen
  watermark1.composite(watermark2, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  // Aplicar la marca de agua a la imagen
  image.composite(watermark1, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  var nameB = "backdrop.jpeg";

  // Guardar la imagen en formato png con calidad al 100%
  image.quality(100).scale(1).write('b.bin');

  // Enviar la imagen como respuesta
  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header(
    'Content-Type', 'image/jpeg'
   );
   res.send(buffer);
  });
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/bSeries?b=IMG&p=IMG"
app.get('/bSeries', async (req, res) => {
 const b = req.query.b;
 const p = req.query.p;

 if (!b || !p) {
  return res.status(400).json({ error: 'No se proporcionaron los enlaces de las imágenes' });
 }

 console.log(`Se solicitaron las siguientes imágenes: '${b}' y '${p}' en la ruta '/bSeries'`);

 try {
  const background = await sharp(b).resize(1280, 720).toBuffer();
  const foreground = await sharp(p).resize(480, 720).toBuffer();

  // Combinar las imágenes
  const combinedImage = await sharp({
    create: {
     width: 1280,
     height: 720,
     channels: 4,
     background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
   })
   .composite([
    { input: background, gravity: 'north-west', left: 60, top: 0 },
    { input: foreground, gravity: 'center' }
    ])
   .webp({ quality: 100 })
   .toBuffer();

  res.header('Content-Type', 'image/webp');
  res.send(combinedImage);
 } catch (error) {
  res.status(500).json({ error: 'Error al procesar las imágenes' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/keep-alive"
app.get('/keep-alive', (req, res) => {
 // Aquí puedes hacer algo simple, como enviar una respuesta vacía
 res.send('');
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 // Código del cliente para mantener la conexión activa
 setInterval(() => {
  fetch(`http://localhost:${port}/keep-alive`)
   .then(response => {
    console.log('Sigo vivo 🎉');
   })
   .catch(error => {
    console.error('Error en la solicitud de keep-alive:', error);
   });
 }, 5 * 60 * 1000); // 30 minutos * 60 segundos * 1000 milisegundos
});