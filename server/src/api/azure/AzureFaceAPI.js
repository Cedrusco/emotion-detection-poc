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

  async analyzeFace(url) {
    let result;
    try {
      result = await this.client.face.detectWithUrl(url, {
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
      throw new Error('analyzeFace method failed')
    }

    return result;
  }
}

module.exports = AzureFaceAPI;
