// Importar las bibliotecas requeridas
const express = require('express');
const Jimp = require('jimp');

// Crea una aplicación en Express
const app = express();
const port = 8225;

// Middleware para procesar datos JSON
app.use(express.json());

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/p"
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
  const image = await Jimp.read(url);

  // Redimensionar la imagen a 720x1080
  image.resize(720, 1080);

  // Cargar las marcas de agua
  const watermark1 = await Jimp.read('Wtxt-poster.png');
  const watermark2 = await Jimp.read('Wlogo-poster.png');

  // Escala la marca de agua a 1280px de ancho por 720px de alto
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

  // Guardar la imagen en formato JPEG con calidad al 100%
  image.quality(100).scale(1.5).write('p.bin');

  // Enviar la imagen como respuesta
  image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen' });
   }
   res.header(
    'Content-Type', 'image/jpeg'
   );
   res.send(buffer);
  });
 } catch (error) {
  res.status(500).json({ error: 'Error al procesar la imagen' });
 }
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/b"
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

  var nameB = "backdrop.jpeg";

  // Guardar la imagen en formato png con calidad al 100%
  image.quality(100).scale(1).write('b.bin');

  // Enviar la imagen como respuesta
  image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen' });
   }
   res.header(
    'Content-Type', 'image/jpeg'
   );
   res.send(buffer);
  });
 } catch (error) {
  res.status(500).json({ error: 'Error al procesar la imagen' });
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