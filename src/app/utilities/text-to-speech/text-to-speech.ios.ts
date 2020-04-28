import { SpeakOptions } from './index';

let doneCallback;

class MySpeechDelegate extends NSObject {
  public static ObjCProtocols = [AVSpeechSynthesizerDelegate];
  public speechSynthesizerDidStartSpeechUtterance(synthesizer, utterance) {
    // TODO
  }

  public speechSynthesizerDidFinishSpeechUtterance(synthesizer, utterance) {
    if (doneCallback) {
      doneCallback();
    }
  }

  public speechSynthesizerDidPauseSpeechUtterance(synthesizer, utterance) {
    // TODO
  }

  public speechSynthesizerDidContinueSpeechUtterance(synthesizer, utterance) {
    // console.log("Continued speaking");
  }

  public speechSynthesizerDidCancelSpeechUtterance(synthesizer, utterance) {
    // console.log("Cancelled speaking");
  }
}

// , {
// 	// The name for the registered Objective-C class.
// 	name: "MySpeechDelegate",
// 		// Declare that the native Objective-C class will implement the AVSpeechSynthesizerDelegate Objective-C protocol.
// 		protocols: [AVSpeechSynthesizerDelegate]
// };

export class TNSTextToSpeech {
  private _speechSynthesizer: any; /// AVSpeechSynthesizer
  private _lastOptions: SpeakOptions = null;

  public speak(options: SpeakOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this._speechSynthesizer) {
        this._speechSynthesizer = AVSpeechSynthesizer.alloc().init();
        this._speechSynthesizer.delegate = new MySpeechDelegate();
      }

      if (!this.isString(options.text)) {
        reject('Text is required to speak.');
        return;
      }

      this._lastOptions = options;

      doneCallback = options.finishedCallback;

      // valid values for pitch are 0.5 to 2.0
      if (!this.isNumber(options.pitch)) {
        options.pitch = 1.0;
      } else if (options.pitch < 0.5) {
        options.pitch = 0.5;
      } else if (options.pitch > 2.0) {
        options.pitch = 2.0;
      }

      // valid values are AVSpeechUtteranceMinimumSpeechRate to AVSpeechUtteranceMaximumSpeechRate
      if (!this.isNumber(options.speakRate)) {
        options.speakRate = AVSpeechUtteranceMaximumSpeechRate / 4.0; // default rate is way too fast
      } else if (options.speakRate < AVSpeechUtteranceMinimumSpeechRate) {
        options.speakRate = AVSpeechUtteranceMinimumSpeechRate;
      } else if (options.speakRate > AVSpeechUtteranceMaximumSpeechRate) {
        options.speakRate = AVSpeechUtteranceMaximumSpeechRate;
      }

      // valid values for volume are 0.0 to 1.0
      if (!this.isNumber(options.volume) || options.volume > 1.0) {
        options.volume = 1.0;
      } else if (options.volume < 0.0) {
        options.volume = 0.0;
      }

      const speechUtterance = AVSpeechUtterance.alloc().initWithString(
        options.text
      );

      if (this.isString(options.locale) && this.isValidLocale(options.locale)) {
        speechUtterance.voice = AVSpeechSynthesisVoice.voiceWithLanguage(
          options.locale
        );
      } else if (
        this.isString(options.language) &&
        this.isValidLocale(options.language)
      ) {
        speechUtterance.voice = AVSpeechSynthesisVoice.voiceWithLanguage(
          options.language
        );
      }

      speechUtterance.pitchMultiplier = options.pitch;
      speechUtterance.volume = options.volume;
      speechUtterance.rate = options.speakRate;

      if (!this.isBoolean(options.queue)) {
        options.queue = false;
      }

      if (!options.queue && this._speechSynthesizer.speaking) {
        this._speechSynthesizer.stopSpeakingAtBoundary(
          AVSpeechBoundary.Immediate
        );
      }

      this._speechSynthesizer.speakUtterance(speechUtterance);
      resolve();
    });
  }

  public pause(now) {
    this._speechSynthesizer.pauseSpeakingAtBoundary(
      now ? AVSpeechBoundary.Immediate : AVSpeechBoundary.Word
    );
  }

  public resume() {
    this._speechSynthesizer.continueSpeaking();
  }

  public destroy() {
    /// does iOS have anything to destroy/free resources???
    this._speechSynthesizer = null;
  }

  /**
   * Private Methods
   */

  private isString(elem) {
    return Object.prototype.toString.call(elem).slice(8, -1) === 'String';
  }

  private isBoolean(elem) {
    return Object.prototype.toString.call(elem).slice(8, -1) === 'Boolean';
  }

  private isNumber(elem) {
    return Object.prototype.toString.call(elem).slice(8, -1) === 'Number';
  }

  // helper function to test whether language code has valid syntax
  private isValidLocale(locale) {
    const re = new RegExp('\\w\\w-\\w\\w');
    return re.test(locale);
  }
}
