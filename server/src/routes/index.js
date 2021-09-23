const AzureFaceAPI = require('../api/azure/AzureFaceAPI');
const EmpathClient = require('../api/empath/EmpathWebAPI');
const WatsonAPI = require('../api/watson/WatsonAPI');

const router = require('express').Router();

router.post('/analyze', async (req, res) => {
  try {
    const { voiceAudio, faceImages } = req.body;

    const faceClient = new AzureFaceAPI();
    const watsonClient = new WatsonAPI();

    const faceResults = [];

    for (let i = 0; i < faceImages.length; i++) {
      const decodedImage = faceClient.decodeBase64Image(faceImages[i]);
      const result = await faceClient.analyzeFace(decodedImage.data)
      if (result) faceResults.push(result);
    }

    const averages = faceClient.computeAverageEmotions(faceResults);

    const decodedAudio = faceClient.decodeBase64Image(voiceAudio);
    const empathResults = await EmpathClient.analyzeAudio(decodedAudio.data);
    const watsonResults = await watsonClient.analyzeSemanticTone(decodedAudio.data);

    res.json({
      rawData: {
        azureFaceAPIResults: {
          resultsArray: faceResults,
          resultsAverage: averages
        },
        empathWebAPIResults: empathResults,
        watsonToneAnalyzerResults: watsonResults
      },
    });
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;