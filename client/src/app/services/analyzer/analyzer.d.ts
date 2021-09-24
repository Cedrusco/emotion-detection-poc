export interface AnalyzerResponse {
  emotion: string;
  rawData: {
    azureFaceAPIResutls: AzureFaceAPIResultsArray;
    empathWebAPIResults: EmpathWebAPIResults;
    watsonToneAnalyzerResults: WatsonToneAnalyzerResults;
  };
}

interface WatsonToneAnalyzerResults {
  document_tone: [{ score: number; tone_id: string, tone_name: string }];
  sentences_tone: [
    { text: string; tones: [{ score: number; tone_id: string, tone_name: string }] }
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

