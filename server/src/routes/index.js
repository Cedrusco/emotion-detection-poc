const AzureFaceAPI = require('../api/azure/AzureFaceAPI');

const router = require('express').Router();

router.post('/analyze', async (req, res) => {
  try {
    const { voiceAudio, faceImages } = req.body;

    const faceClient = new AzureFaceAPI();

    const faceResults = [];

    for (let i = 0; i < faceImages.length; i++) {
      const decodedImage = faceClient.decodeBase64Image(faceImages[i]);
      const result = await faceClient.analyzeFace(decodedImage.data)
      if (result) faceResults.push(result);
    }

    const averages = faceClient.computeAverageEmotions(faceResults);

    res.json({
      rawData: {
        azureFaceAPIResults: {
          resultsArray: faceResults,
          resultsAverage: averages
        }
      },
    });
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;