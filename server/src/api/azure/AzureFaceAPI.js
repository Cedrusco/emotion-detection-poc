const { FaceClient } = require('@azure/cognitiveservices-face');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');

class AzureFaceAPI {
  client;

  constructor() {
    const credentials = new ApiKeyCredentials({
      inHeader: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_FACE_APIKEY,
      },
    });
    this.client = new FaceClient(credentials, process.env.AZURE_FACE_URL);
  }
}

module.exports = AzureFaceAPI;
