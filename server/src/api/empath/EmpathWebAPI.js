const axios = require('axios');
const FormData = require('form-data');

class EmpathWebAPI {
  static async analyzeAudio(voiceAudio) {
    try {
      let data = new FormData();

      data.append('apikey', process.env.EMPATH_APIKEY);
      data.append('wav', voiceAudio);
      const config = {
        headers: { ...data.getHeaders() },
      };
      return (await axios.post(process.env.EMPATH_URL, data, config)).data;
    } catch (e) {
      console.log(e);
      throw new Error('analyzeAudio method failed');
    }
  }
}

module.exports = EmpathWebAPI;