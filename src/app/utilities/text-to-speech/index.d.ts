export declare class TNSTextToSpeech {
  /**
     * Initiate the text to speech.
     * @param {object} SpeakOptions - SpeakOptions object.
     */
  speak(options: SpeakOptions): Promise<any>;

  /**
     * Release the resources used by the TextToSpeech engine/synthesizer
     */
  destroy(): void;

  /**
     * Pause the engine/synthesizer currently speaking.
     */
  pause(): void;

  /**
     * Resume the engine/synthesizer. On Android it will start from beginning - since there is no actual pause, only stop.
     */
  resume(): void;

  /**
     * Android only: Returns array of available Languages
     */
  getAvailableLanguages(): Promise<Language[]>;
}

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
