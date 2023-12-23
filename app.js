// Import the required libraries
const express = require('express');
const Jimp = require('jimp');

// Create an Express app
const app = express();
const port = 8225;

// Middleware to parse JSON bodies
app.use(express.json());

// Define the "/b" route
app.get('/b', async (req, res) => {
  try {
    // Check if the link image is provided
    if (!req.query.url) {
      return res.status(400).send('Please provide a link to the image.');
    }

    // Load the link image
    const image = await Jimp.read(req.query.url);

    // Scale the image to 1280px width by 720px height
    image.scaleToFit(1280, 720);

    // Load the watermark image
    const watermark = await Jimp.read('wm-backdrop_v4.png');

    // Scale the watermark to 1280px width by 720px height
    watermark.scaleToFit(1280, 720);

    // Set watermark opacity to 1
    watermark.opacity(1);

    // Place the watermark on the image
    image.composite(watermark, 0, 0, {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 1,
      opacityDest: 1,
    });

    // Convert the image to JPEG
    const buffer = await image.quality(95).getBufferAsync(Jimp.MIME_JPEG);

    // Send the image as the response
    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the image.');
  }
});

// Define the "/p" route
app.get('/p', async (req, res) => {
  try {
    // Check if the link image is provided
    if (!req.query.url) {
      return res.status(400).send('Please provide a link to the image.');
    }

    // Load the link image
    const image = await Jimp.read(req.query.url);

    // Scale the image to 720px width by 1080px height
    image.scaleToFit(720, 1080);

    // Load the watermark image
    const watermark = await Jimp.read('wm-poster_v2.png');

    // Scale the watermark to 720px width by 1080px height
    watermark.scaleToFit(720, 1080);

    // Set watermark opacity to 0.25
    watermark.opacity(0.25);

    // Place the watermark on the image
    image.composite(watermark, 0, 0, {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 1,
      opacityDest: 1,
    });

    // Convert the image to JPEG
    const buffer = await image.quality(95).getBufferAsync(Jimp.MIME_JPEG);

    // Send the image as the response
    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the image.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});