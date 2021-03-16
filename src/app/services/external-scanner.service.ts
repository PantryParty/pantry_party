import { Injectable } from "@angular/core";
import { getBoolean, setBoolean } from "@nativescript/core/application-settings";

@Injectable({
  providedIn: "root"
})
export class ExternalScannerService {
  get enabled() {
    return getBoolean("externalScanner.enabled", false);
  }

  set enabled(val: boolean) {
    setBoolean("externalScanner.enabled", val);
  }
}
