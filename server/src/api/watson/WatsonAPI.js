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
        model: 'en-US_NarrowbandModel',
        contentType: 'application/octet-stream',
      };

      const sttResult = await this.client.speechToTextAPI.recognize(sttParams);
      if (sttResult) {
        return sttResult.result.results[0].alternatives[0].transcript;
      } else {
        throw new Error('stt failed to transcribe to audio to text');
      }
    } catch (e) {
      console.error(e);
      throw new Error('speechToText method failed');
    }
  }

  async analyzeSemanticTone(audio) {
    try {
      const text = await this.speechToText(audio);

      const toneParams = {
        toneInput: { text },
        contentType: 'application/json',
      };

      const toneResult = await this.client.toneAnalyzerAPI.tone(toneParams);
      if (toneResult) {
        return { text, toneResult: toneResult.result};
      } else {
        throw new Error('toneAnalyzer failed to detect tone of text');
      }
    } catch (e) {
      console.error(e);
      throw new Error('analyzeSemanticTone method failed');
    }
  }
}

module.exports = WatsonAPI;
