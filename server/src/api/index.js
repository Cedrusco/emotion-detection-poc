const router = require('express').Router();

router.post('/analyze', (req, res) => {
  const { voiceAudio, faceImages } = req.body;

  console.log(voiceAudio, faceImages);

  res.json({ voiceAudio, faceImages });
});

module.exports = router;