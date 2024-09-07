const express = require('express');
const jimp = require('jimp-compact');
const sharp = require('sharp'); // Importa sharp

const app = express();
const port = 8225;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/p', async (req, res) => {
 const url = req.query.url;

 if (!url) {
  return res.status(400).json({ error: 'No se proporcionó un enlace' });
 }

 console.log(`Se solicitó la siguiente imagen: '${url}' en la ruta '/p'`);

 try {
  const imageBuffer = await sharp(url).resize(720, 1080).toBuffer(); // Comprime la imagen
  const image = await jimp.read(imageBuffer);

  // Limitar tamaño de archivo
  if (image.bitmap.width > 720 || image.bitmap.height > 1080) {
   return res.status(400).json({ error: 'La imagen es demasiado grande' });
  }

  const watermark1 = await jimp.read('Wtxt-poster.png');
  const watermark2 = await jimp.read('Wlogo-poster.png');

  watermark1.resize(720, 1080);
  watermark2.resize(720, 1080);

  watermark1.opacity(0.08);
  watermark2.opacity(0.40);

  watermark1.composite(watermark2, 0, 0);
  image.composite(watermark1, 0, 0);

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

   // Optimización de la memoria
   image.destroy();
   watermark1.destroy();
   watermark2.destroy();
  });
 } catch (error) {
  console.error('Error al procesar las imágenes:', error);
  res.status(500).json({ error: 'Error al generar la imagen CATCH' });
 }
});

// Repite el mismo proceso para la ruta '/b'

app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);
});
