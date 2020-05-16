import { Component } from "@angular/core";
import { PrivacyService } from "~/app/services/privacy.service";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { EventData } from "tns-core-modules/ui/page/page";
import { ExternalScannerService } from "~/app/services/external-scanner.service";

@Component({
  selector: "ns-external-scanner",
  templateUrl: "./component.html",
  styleUrls: ["./component.css"]
})
export class ExternalScannerSettingsComponent {

  settings = [
    {
      title: "Enable External Scanner",
      description: "External scanners are better and faster at reading. Turn this on to enable this option.",
      key: "enabled"
    }
  ];

  constructor(
    public externalScanner: ExternalScannerService
  ) { }

  switchChanged(evt: EventData, item: any) {
    const sw = evt.object as Switch;
    this.externalScanner[item.key] = sw.checked;
  }
}
