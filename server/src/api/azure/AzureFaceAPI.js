const { FaceClient } = require('@azure/cognitiveservices-face');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');

class AzureFaceAPI {
  constructor() {
    try {
      const credentials = new ApiKeyCredentials({
        inHeader: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_FACE_APIKEY,
        },
      });
      this.client = new FaceClient(credentials, process.env.AZURE_FACE_URL);
    } catch (e) {
      console.error(e);
      throw new Error('AzureFaceAPi failed to connect');
    }
  }

  async analyzeFace(buffer) {
    let result;
    try {
      result = await this.client.face.detectWithStream(buffer, {
        detectionModel: 'detection_01',
        faceIdTimeToLive: 86400,
        recognitionModel: 'recognition_04',
        returnFaceAttributes: ['emotion'],
        returnfaceId: true,
        returnFaceLandmarks: false,
        returnRecognitionModel: false,
      });
    } catch (e) {
      console.error(e);
      throw new Error('analyzeFace method failed');
    }
    
    return result[0]?.faceAttributes?.emotion;
  }

  computeAverageEmotions(results) {
    const averages = {};

    results.forEach((result) => {
      for (let emotion in result) {
        if ({}.hasOwnProperty.call(result, emotion)) {
          if (!averages[emotion]) {
            averages[emotion] = result[emotion];
          } else {
            averages[emotion] += result[emotion];
          }
        }
      }
    });

    for (let emotion in averages) {
      if ({}.hasOwnProperty.call(averages, emotion)) {
        averages[emotion] /= results.length;
      }
    }

    return averages;
  }

  decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      decodedString = {};

    if (matches.length !== 3) {
      throw new Error('Invalid input string');
    }

    decodedString.type = matches[1];
    decodedString.data = Buffer.from(matches[2], 'base64');

    return decodedString;
  }
}

module.exports = AzureFaceAPI;
