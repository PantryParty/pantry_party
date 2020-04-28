import { android as androidApplication  } from "tns-core-modules/application";
import { Observable, ReplaySubject } from "rxjs";
import { OnDestroy } from "@angular/core";
import { takeUntil, concatMap } from "rxjs/operators";
import { TNSTextToSpeech, SpeakOptions  } from "../utilities/text-to-speech";

interface ScanSuccess {
  status: "success";
  itemName: string;
}

interface ScanFailure {
  status: "failure";
}

export type FinalScanResults = ScanSuccess | ScanFailure;

export class ScannedAnnouncerService implements OnDestroy {
  private ngUnsubscribe = new ReplaySubject<true>();

  private TTS = new TNSTextToSpeech();

  constructor(
    stream: Observable<FinalScanResults>
  ) {
    stream.pipe(
      takeUntil(this.ngUnsubscribe),
      concatMap(r => {
        if (r.status === "failure") {
          return this.speak("Item lookup failure");
        } else {
          return this.speak(r.itemName);
        }
      })
    ).subscribe(
      r => console.log("successfully spoke"),
      e => console.log("error speaking", e.message)
    );
  }

  speak(text: string) {
    return this.TTS.speak({
      ...this.speakOptions,
      text
    });
  }

  get speakOptions(): SpeakOptions {
    return   {
      text: "",
      speakRate: androidApplication ? 1.0 : 0.5
    };
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
  }
}
