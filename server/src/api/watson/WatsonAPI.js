const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

class WatsonAPI {
  constructor() {
    const speechToTextAPI = new SpeechToTextV1({
      authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_STT_APIKEY,
      }),
      serviceUrl: process.env.WATSON_STT_URL,
    });

    const toneAnalyzerAPI = new ToneAnalyzerV3({
      version: process.env.WATSON_TONE_ANALYZER_VERSION,
      authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_TONE_ANALYZER_APIKEY,
      }),
    });

    this.client = { speechToTextAPI, toneAnalyzerAPI };
  }

  async speechToText(audio) {
    try {
      const sttParams = {
        audio,
        model: 'en-US_NarrowbandModel'
      };

      return (await this.client.speechToTextAPI.recognize(sttParams)).results[0]
    } catch (e) {
      console.error(e);
      throw new Error('speechToText method failed');
    }
  }

  async analyzeSemanticTone(audio) {
    try {
      const toneInput =await this.speechToText(audio);

      const toneParams = {
        toneInput,
        contentType: 'application/json',
      };

      return await this.client.toneAnalyzerAPI.tone(toneParams);
    } catch (e) {
      console.error(e);
      throw new Error('analyzeSemanticTone method failed');
    }
  }
}

module.exports = WatsonAPI;
