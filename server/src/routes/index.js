const { AnalyzeAPI } = require('../api/');

const router = require('express').Router();

router.post('/analyze', async (req, res) => {
  try {
    const { faceImages, voiceAudio } = req.body;

    const analyzeAPI = new AnalyzeAPI();

    const rawData = await analyzeAPI.analyze(faceImages, voiceAudio);
    const emotion = analyzeAPI.calculateEmotion(
      process.env.FACE_WEIGHT,
      process.env.AUDIO_WEIGHT,
      process.env.SEMANTIC_WEIGHT
    );

    res.json({ emotion, rawData });
  } catch (e) {
    console.error(e);
    res.json(e);
  }
});

module.exports = router;
