import { Injectable } from "@angular/core";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings/application-settings";

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
