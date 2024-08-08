// Importar las bibliotecas requeridas
const express = require('express');
const Jimp = require('jimp');

// Crea una aplicación en Express
const app = express();
const port = 8225;

// Middleware para procesar datos JSON
app.use(express.json());

// Función para guardar el enlace de una imagen en la cookie
function saveImageLinkInCookie(imageLink) {
 // Obtener los enlaces guardados en la cookie
 let imageLinksCookie = getCookieValue('imageLinksCookie');

 // Si no hay enlaces guardados, crear un nuevo array
 if (!imageLinksCookie) {
  imageLinksCookie = [];
 } else {
  // De lo contrario, convertir el string a un array
  imageLinksCookie = JSON.parse(imageLinksCookie);
 }

 // Verificar si el enlace ya está en el array
 if (!imageLinksCookie.includes(imageLink)) {
  // Si no, agregarlo al array
  imageLinksCookie.push(imageLink);

  // Guardar el array actualizado en la cookie
  setCookieValue('imageLinksCookie', JSON.stringify(imageLinksCookie), 30);
 }
}

// Función para verificar si un enlace de imagen está en la cookie
function isImageLinkInCookie(imageLink) {
 // Obtener los enlaces guardados en la cookie
 let imageLinksCookie = getCookieValue('imageLinksCookie');

 // Si no hay enlaces guardados, retornar false
 if (!imageLinksCookie) {
  return false;
 }

 // De lo contrario, convertir el string a un array y verificar si el enlace está incluido
 imageLinksCookie = JSON.parse(imageLinksCookie);
 return imageLinksCookie.includes(imageLink);
}

// Función para obtener el valor de una cookie
function getCookieValue(cookieName) {
 let name = cookieName + "=";
 let decodedCookie = decodeURIComponent(document.cookie);
 let ca = decodedCookie.split(';');
 for (let i = 0; i < ca.length; i++) {
  let c = ca[i];
  while (c.charAt(0) == ' ') {
   c = c.substring(1);
  }
  if (c.indexOf(name) == 0) {
   return c.substring(name.length, c.length);
  }
 }
 return "";
}

// Función para establecer el valor de una cookie
function setCookieValue(cookieName, cookieValue, expirationDays) {
 let d = new Date();
 d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
 let expires = "expires=" + d.toUTCString();
 document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Ruta "/ws"
app.get('/ws', async (req, res) => {
 const url = req.query.url;

 // Verificar si el enlace ya está en la cookie
 if (isImageLinkInCookie(url)) {
  // Si está en la cookie, cargar la imagen directamente de la caché
  // ...
 } else {
  // Si no está en la cookie, procesar la imagen normalmente
  // y guardar el enlace en la cookie
  try {
   // Cargar la imagen desde el enlace
   const image = await Jimp.read(url);

   // Redimensionar la imagen a 720x1080
   image.resize(360, 720);

   // Cargar las marcas de agua
   const watermark1 = await Jimp.read('Wtxt-poster.png');
   const watermark2 = await Jimp.read('Wlogo-poster.png');

   // Escala la marca de agua a 1280px de ancho por 720px de alto
   watermark1.resize(360, 720);
   watermark2.resize(360, 720);

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
   // Guardar el enlace de la imagen en la cookie
   saveImageLinkInCookie(url);
  } catch (error) {
   res.status(500).json({ error: 'Error al procesar la imagen' });
  }
 }
});

// Ruta "/p"
app.get('/p', async (req, res) => {
 const url = req.query.url;

 // Verificar si el enlace ya está en la cookie
 if (isImageLinkInCookie(url)) {
  // Si está en la cookie, cargar la imagen directamente de la caché
  // ...
 } else {
  // Si no está en la cookie, procesar la imagen normalmente
  // y guardar el enlace en la cookie
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
   // Guardar el enlace de la imagen en la cookie
   saveImageLinkInCookie(url);
  } catch (error) {
   res.status(500).json({ error: 'Error al procesar la imagen' });
  }
 }
});

// Ruta "/b"
app.get('/b', async (req, res) => {
 const url = req.query.url;

 // Verificar si el enlace ya está en la cookie
 if (isImageLinkInCookie(url)) {
  // Si está en la cookie, cargar la imagen directamente de la caché
  // ...
 } else {
  // Si no está en la cookie, procesar la imagen normalmente
  // y guardar el enlace en la cookie
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
   watermark1.opacity(0.25);
   watermark2.opacity(1);

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
   // Guardar el enlace de la imagen en la cookie
   saveImageLinkInCookie(url);
  } catch (error) {
   res.status(500).json({ error: 'Error al procesar la imagen' });
  }
 }
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);
});
