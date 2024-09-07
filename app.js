const express = require('express');
const jimp = require('jimp-compact');

const app = express();
const port = 8225;

app.use(express.json());

app.get('/p', async (req, res) => {
 const url = req.query.url;

 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/p'`);

 try {
  const image = await jimp.read(url);

  image.resize(720, 1080, jimp.RESIZE_MAGPHASE);

  const watermark1 = await jimp.read('Wtxt-poster.png');
  const watermark2 = await jimp.read('Wlogo-poster.png');

  watermark1.resize(720, 1080);
  watermark2.resize(720, 1080);

  watermark1.opacity(0.08);
  watermark2.opacity(0.40);

  watermark1.composite(watermark2, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  image.composite(watermark1, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const fileName = `poster_${randomNumber}.webp`;

  image.quality(100).scale(1).write(fileName);

  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header(
    'Content-Type', 'image/webp',
    'Content-Disposition', `attachment; filename="${fileName}"`
   );
   res.send(buffer);
  });
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

app.get('/b', async (req, res) => {
 const url = req.query.url;

 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/b'`);

 try {
  const image = await jimp.read(url);

  image.resize(1280, 720, jimp.RESIZE_MAGPHASE);

  const watermark1 = await jimp.read('Wtxt-Backdrop.png');
  const watermark2 = await jimp.read('Wlogo-Backdrop.png');

  watermark1.resize(1280, 720);
  watermark2.resize(1280, 720);

  watermark1.opacity(0.08);
  watermark2.opacity(0.40);

  watermark1.composite(watermark2, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  image.composite(watermark1, 0, 0, {
   mode: jimp.BLEND_SOURCE_OVER,
   opacitySource: 1.0,
   opacityDest: 1.0
  });

  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const fileName = `backdrop_${randomNumber}.webp`;

  image.quality(100).scale(1).write(fileName);

  image.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
   if (err) {
    return res.status(500).json({ error: 'Error al generar la imagen BUFFER' });
   }
   res.header(
    'Content-Type', 'image/webp',
    'Content-Disposition', `attachment; filename="${fileName}"`
   );
   res.send(buffer);
  });
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

app.get('/keep-alive', (req, res) => {
 res.send('');
});

app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 setInterval(() => {
  fetch(`http://localhost:${port}/keep-alive`)
   .then(response => {
    const currentDate = new Date();
    const formattedTime = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    console.log(`Sigo vivo 🎉 (${formattedTime})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de keep-alive:', error);
   });
 }, 5 * 60 * 1000);
});
