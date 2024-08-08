// Importar las bibliotecas requeridas
const express = require('express');
const Jimp = require('jimp');

// Crea una aplicación en Express
const app = express();
const port = 8225;

// Middleware para procesar datos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Función para establecer la cookie de la imagen
function setImageCookie(req, res, imageUrl, sent) {
  res.cookie(`image_${imageUrl}`, sent, { expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), path: '/' });
}

// Función para obtener el estado de la cookie de la imagen
function getImageCookie(req, imageUrl) {
  return req.cookies[`image_${imageUrl}`];
}

// Ruta "/p"
app.get('/p', async (req, res) => {
  const url = req.query.url;

  // Verificar si se suministró un enlace
  if (!url) {
    return res.status(400).json({ error: 'No se proporcionó un enlace' });
  }

  try {
    // Verificar si la imagen ya fue enviada
    var imageSent = getImageCookie(req, url);
    if (imageSent === "true") {
      // La imagen ya fue enviada, no es necesario enviarla de nuevo
      console.log("La imagen ya fue enviada anteriormente");
      return res.status(200).json({ message: 'La imagen ya fue enviada anteriormente' });
    }

    // Cargar la imagen desde el enlace
    const image = await Jimp.read(url);

    // Redimensionar la imagen a 720x1080
    image.resize(360, 720);

    // Cargar las marcas de agua
    const watermark1 = await Jimp.read('Wtxt-poster.png');
    const watermark2 = await Jimp.read('Wlogo-poster.png');

    // Escala la marca de agua a 1280px de ancho por 720px de alto
    watermark1.resize(720, 1080);
    watermark2.resize(720, 1080);

    // Establece la opacidad de la watermark1 a 0.375 y watermark2 a 0.75
    watermark1.opacity(0.20);
    watermark2.opacity(0.35);

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
    image.quality(100).scale(1.5).write('poster.jpeg');

    // Establecer la cookie de la imagen como "enviada"
    setImageCookie(req, res, url, "true");

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
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});