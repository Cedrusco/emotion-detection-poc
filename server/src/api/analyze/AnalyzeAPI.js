const AzureFaceAPI = require('../azure/AzureFaceAPI');
const WatsonAPI = require('../watson/WatsonAPI');
const EmpathWebAPI = require('../empath/EmpathWebAPI');

const { emotionMap } = require('../analyze/analyze.constants');

class AnalyzeAPI {
  results;

  constructor() {
    this.faceClient = new AzureFaceAPI();
    this.watsonClient = new WatsonAPI();
    this.empathClient = EmpathWebAPI;
  }

  async analyze(faceImages, voiceAudio) {
    const faceResults = [];

    for (let i = 0; i < faceImages.length; i++) {
      const decodedImage = this.faceClient.decodeBase64Image(faceImages[i]);
      const result = await this.faceClient.analyzeFace(decodedImage.data);
      if (result) faceResults.push(result);
    }

    const averages = this.faceClient.computeAverageEmotions(faceResults);

    const decodedAudio = this.faceClient.decodeBase64Image(voiceAudio);
    const empathResults = await this.empathClient.analyzeAudio(
      decodedAudio.data
    );
    const watsonResults = await this.watsonClient.analyzeSemanticTone(
      decodedAudio.data
    );

    this.result = {
      azureFaceAPIResults: {
        resultsArray: faceResults,
        resultsAverage: averages,
      },
      empathWebAPIResults: empathResults,
      watsonToneAnalyzerResults: watsonResults,
    };

    return this.result;
  }

  calculateEmotion(faceWeight, audioWeight, semanticWeight) {
    const resultObject = {};

    if (!this.result) {
      return null;
    }

    this._calculateAudioEmotion(resultObject, audioWeight);
    this._calculateFaceEmotion(resultObject, faceWeight);
    this._calculateSemanticEmotion(resultObject, semanticWeight);

    let maxValue = 0,
      emotion = '';

    for (let key in resultObject) {
      if ({}.hasOwnProperty.call(resultObject, key)) {
        if (resultObject[key] > maxValue) {
          maxValue = resultObject[key];
          emotion = key;
        }
      }
    }

    return emotion;
  }

  _calculateAudioEmotion(resultObject, audioWeight) {
    const rawData = this.result?.empathWebAPIResults;

    for (let key in rawData) {
      if ({}.hasOwnProperty.call(rawData, key)) {
        if (!resultObject[emotionMap[key]]) {
          resultObject[emotionMap[key]] = 0;
        }
        resultObject[emotionMap[key]] += audioWeight * (rawData[key] / 50);
      }
    }
  }

  _calculateFaceEmotion(resultObject, faceWeight) {
    const rawData = this.result?.azureFaceAPIResults?.resultsAverage;

    for (let key in rawData) {
      if ({}.hasOwnProperty.call(rawData, key)) {
        if (!resultObject[emotionMap[key]]) {
          resultObject[emotionMap[key]] = 0;
        }
        resultObject[emotionMap[key]] += faceWeight * rawData[key];
      }
    }
  }

  _calculateSemanticEmotion(resultObject, semanticWeight) {
    const rawData = this.result?.watsonToneAnalyzerResults?.toneResult?.document_tone?.tones;

    rawData.forEach(tone => {
      if (!resultObject[emotionMap[tone.tone_id]]) {
        resultObject[emotionMap[tone.tone_id]] = 0
      }
      resultObject[emotionMap[tone.tone_id]] += semanticWeight * tone.score;
    })
  }
}

module.exports = AnalyzeAPI;
