const AzureFaceAPI = require('../api/azure/AzureFaceAPI');

const router = require('express').Router();

router.post('/analyze', (req, res) => {
  const { voiceAudio, faceImages } = req.body;

  console.log(voiceAudio, faceImages);

  const faceClient = new AzureFaceAPI();

  res.json({ voiceAudio, faceImages, faceClient });
});

module.exports = router;