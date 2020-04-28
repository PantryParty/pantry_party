export interface SpeakOptions {
  text: string;
  queue?: boolean;
  pitch?: number;
  speakRate?: number;
  volume?: number;
  locale?: string;
  language?: string;
  finishedCallback?: Function;
}

export interface Language {
  language: string;
  languageDisplay: string;
  country: string;
  countryDisplay: string;
}
