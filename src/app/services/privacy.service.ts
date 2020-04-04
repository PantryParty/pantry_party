import { Injectable } from "@angular/core";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings/application-settings";

@Injectable({
  providedIn: "root"
})
export class PrivacyService {
  get allowAds() {
    return getBoolean("privacy.allowBooleans", true);
  }

  set allowAds(val: boolean) {
    setBoolean("privacy.allowBooleans", val);
  }

  get showAds() {
    return this.allowAds && getBoolean("app.setupComplete", false);
  }

  get allowAnalytics() {
    return getBoolean("privacy.allowAnalytics", true);
  }

  set allowAnalytics(val: boolean) {
    setBoolean("privacy.allowAnalytics", val);
  }
}
