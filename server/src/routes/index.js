const AzureFaceAPI = require('../api/azure/AzureFaceAPI');

const router = require('express').Router();

router.post('/analyze', async (req, res) => {
  try {
  const { voiceAudio, faceImages } = req.body;

  console.log(voiceAudio, faceImages);

  const faceClient = new AzureFaceAPI();
  const imageUrl = faceImages[0];

  const result = await faceClient.analyzeFace(imageUrl);

  res.json({ voiceAudio, faceImages, result });
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;