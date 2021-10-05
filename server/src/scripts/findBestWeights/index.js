require('dotenv').config();

// import sample data.
const sampleData = require('./sampleData');

// import analyzeAPI
const AnalyzeAPI = require('../../api/analyze/AnalyzeAPI');

const weights = [
  [0, 0, 1],
  [0, 0.5, 0.5],
  [0.5, 0.5, 0.5],
  [0.165, 0.4125, 0.4125],
  [0, 1, 0],
  [1, 0, 0],
];

async function findBestWeights(sampleData, weights) {
  const performanceTracker = {};

  const analyzeAPI = new AnalyzeAPI();

  // loop over sampleData
  for (let i = 0; i < sampleData.length; i++) {
    const sample = sampleData[i];
    const { faceImages, voiceAudio } = sample;

    try {
      // call analyze once.
      await analyzeAPI.analyze(faceImages, voiceAudio);

      // call calculateEmotion for each possible ratio of weights.
      weights.forEach((weightArr, index) => {
        const [faceWeight, audioWeight, semanticWeight] = weightArr;

        const emotion = analyzeAPI.calculateEmotion(
          faceWeight,
          audioWeight,
          semanticWeight
        );

        // keep track of performance for each weight
        if (emotion === sample.emotion) {
          // identified emotion correctly.
          performanceTracker[index] = !performanceTracker[index]
            ? 1
            : performanceTracker[index] + 1;
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  // print weights with best performance
  let maxKey,
    maxValue = -1;
  for (let key in performanceTracker) {
    if ({}.hasOwnProperty.call(performanceTracker, key)) {
      if (performanceTracker[key] > maxValue) {
        maxKey = key;
        maxValue = performanceTracker[key];
      }
    }
  }

  console.log(
    `Best weight ratio is ${weights[maxKey]} with a performance of ${
      100 * (maxValue / sampleData.length)
    }% correct emotion detections.`
  );
}

findBestWeights(sampleData, weights);
