export interface AnalyzerResponse {
  emotion: string;
  rawData: {
    watsonToneAnalyzerResults: WatsonToneAnalyzerResults;
    azureFaceAPIResutls: AzureFaceAPIResultsArray;
    empathWebAPIResults: EmpathWebAPIResults;
  };
}

interface WatsonToneAnalyzerResults {
  document_tone: [{ score: number; tone_id: String }];
  sentences_tone: [
    { text: string; tones: [{ score: number; tone_id: string }] }
  ];
}

interface AzureFaceAPIResultsArray {
  resutltsArray: AzureFaceAPIResults[];
  resultsAverage: AzureFaceAPIResults;
}

interface AzureFaceAPIResults {
  anger: number;
  contempt: number;
  disgust: number;
  fear: number;
  happiness: number;
  neutral: number;
  sadness: number;
  suprise: number;
}

interface EmpathWebAPIResults {
  calm: number;
  anger: number;
  sorrow: number;
  joy: number;
  energy: number;
}

