import { Component, OnDestroy } from "@angular/core";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { EventData, Page } from "tns-core-modules/ui/page/page";
import { ExternalScannerService } from "~/app/services/external-scanner.service";

@Component({
  selector: "ns-external-scanner",
  templateUrl: "./component.html",
  styleUrls: ["./component.css"]
})
export class ExternalScannerSettingsComponent {

  results = [];
  startScaning = false;

  constructor(
    public externalScanner: ExternalScannerService
  ) { }

  switchChanged(evt: EventData, item: string) {
    const sw = evt.object as Switch;
    this.externalScanner[item] = sw.checked;
  }

  testScannerText() {
    if (this.startScaning) {
      return "Tap to stop scanner";
    } else {
      return "Tap to test scanner";
    }
  }

  toggle() {
    this.startScaning = !this.startScaning;
  }

  newScan({text}) {
    this.results = [text].concat(this.results);
  }
}
