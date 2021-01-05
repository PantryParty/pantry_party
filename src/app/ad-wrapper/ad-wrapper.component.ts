import { Component, AfterViewInit} from "@angular/core";
import * as Admob from "nativescript-admob";
import { envConfig } from "../utilities/env";
import { Screen } from "@nativescript/core";
import { PrivacyService } from "../services/privacy.service";

@Component({
  selector: "ns-ad-wrapper",
  templateUrl: "./ad-wrapper.component.html",
  styleUrls: ["./ad-wrapper.component.css"]
})
export class AdWrapperComponent implements AfterViewInit {
  height: number;

  private testing = envConfig.adTesting;
  private androidBannerId: string = "ca-app-pub-7265627701189310/9591754412";
  private iosBannerId: string = "ca-app-pub-7265627701189310/7896363511";

  constructor(
    private privacyService: PrivacyService
  ) {
    if (!this.privacyService.showAds) {
      this.height = 0;
    } else if (Screen.mainScreen.heightDIPs <= 400) {
      this.height = 32;
    } else if (Screen.mainScreen.heightDIPs <= 720) {
      this.height = 50;
    } else {
      this.height = 90;
    }
  }

  ngAfterViewInit(): void {
    if (this.privacyService.showAds) {
      setTimeout(() => this.createBanner(), 0);
    }
  }

  createBanner() {
    Admob.createBanner({
      testing: this.testing,
      size: Admob.AD_SIZE.SMART_BANNER,
      iosBannerId: this.iosBannerId,
      androidBannerId: this.androidBannerId,
      margins: {
        bottom: 0
      }
    }).then(() =>  console.log("admob createBanner donex"))
    .catch(error =>  console.log("admob createBanner error: " + error));
  }

}
