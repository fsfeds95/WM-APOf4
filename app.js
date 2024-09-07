// Importar las bibliotecas requeridas
const express = require('express');
const jimp = require('jimp');
const fs = require('fs');

// Crea una aplicación en Express
const app = express();
const port = 8225;

// Middleware para procesar datos JSON
app.use(express.json());

// Objeto para almacenar imágenes en caché
const imageCache = {};

// Ruta "/p?url=IMG"
app.get('/p', async (req, res) => {
 const url = req.query.url;

 // Verificar si se suministró un enlace
 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 // Verificar si la imagen está en caché
 if (imageCache[url]) {
  return res.send(imageCache[url]);
 }

 try {
  // Cargar la imagen desde el enlace
  const image = await jimp.read(url);

  // Redimensionar la imagen usando RESIZE_MAGPHASE
  image.resize(720, 1080, jimp.RESIZE_MAGPHASE);

  // Cargar las marcas de agua
  const watermark1 = await jimp.read('Wtxt-poster.png');
  const watermark2 = await jimp.read('Wlogo-poster.png');

  // Escala la marca de agua a 720px de ancho por 1080px de alto
  watermark1.resize(720, 1080);
  watermark2.resize(720, 1080);

  // Establece la opacidad de la watermark1 a 0.08 y un desenfoque del 12%
  watermark1.opacity(0.50).blur(0.25);

  // Establece la opacidad de la watermark2 a 0.40
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

  // Generar un número aleatorio de 4 dígitos entre 0000 y 9999
  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const fileName = `poster_${randomNumber}.webp`;

  // Guardar la imagen en formato WEBP con calidad al 100%
  image.quality(100).scale(1).write(fileName);

  // Guardar la imagen en caché
  const buffer = await image.getBufferAsync(jimp.MIME_JPEG);
  imageCache[url] = buffer;

  // Enviar la imagen como respuesta
  res.header('Content-Type', 'image/webp');
  res.send(buffer);
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }

 console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/p'`);
});

// Ruta para eliminar imágenes de la caché
app.delete('/clear-cache', (req, res) => {
 imageCache = {};
 res.send('Caché de imágenes eliminada');
});

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
    const currentDate = new Date();
    const formattedTime = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    console.log(`Sigo vivo 🎉 (${formattedTime})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de keep-alive:', error);
   });
 }, 5 * 60 * 1000); // 30 minutos * 60 segundos * 1000 milisegundos
});