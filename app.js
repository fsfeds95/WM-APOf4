// Import the required libraries
const express = require('express');
const Jimp = require('jimp');

// Create an Express app
const app = express();
const port = 8225;

// Middleware to parse JSON bodies
app.use(express.json());

// Define the "/backdrop" route
app.get('/backdrop', async (req, res) => {
  try {
    // Check if the link image is provided
    if (!req.query.link) {
      return res.status(400).send('Please provide a link to the image.');
    }

    // Load the link image
    const image = await Jimp.read(req.query.link);

    // Scale the image to 1280px width by 720px height
    image.scaleToFit(1280, 720);

    // Load the watermark image
    const watermark = await Jimp.read('wm-backdrop.png');

    // Set watermark opacity to 0.6
    watermark.opacity(0.6);

    // Place the watermark on the image
    image.composite(watermark, 0, 0, {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 0.6,
      opacityDest: 1,
    });

    // Convert the image to JPEG
    const buffer = await image.quality(90).getBufferAsync(Jimp.MIME_JPEG);

    // Send the image as the response
    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the image.');
  }
});

// Define the "/poster" route
app.get('/poster', async (req, res) => {
  try {
    // Check if the link image is provided
    if (!req.query.link) {
      return res.status(400).send('Please provide a link to the image.');
    }

    // Load the link image
    const image = await Jimp.read(req.query.link);

    // Scale the image to 720px width by 1280px height
    image.scaleToFit(720, 1280);

    // Load the watermark image
    const watermark = await Jimp.read('wm-poster.png');

    // Set watermark opacity to 0.6
    watermark.opacity(0.6);

    // Place the watermark on the image
    image.composite(watermark, 0, 0, {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 0.6,
      opacityDest: 1,
    });

    // Convert the image to JPEG
    const buffer = await image.quality(90).getBufferAsync(Jimp.MIME_JPEG);

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