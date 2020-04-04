import { Component } from "@angular/core";
import { PrivacyService } from "~/app/services/privacy.service";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { EventData } from "tns-core-modules/ui/page/page";

@Component({
  selector: "ns-privacy-settings",
  templateUrl: "./privacy-settings.component.html",
  styleUrls: ["./privacy-settings.component.css"]
})
export class PrivacySettingsComponent {

  settings = [
    {
      title: "Allow Ads",
      description: "Help support continued development by allowing ads. We do get it if you turn them off though.",
      key: "allowAds"
    },
    {
      title: "Allow Analytics",
      description: "Analytics guide development by showing application usage and help catch errors.",
      key: "allowAnalytics"
    }
  ];

  constructor(
    public privacySettings: PrivacyService
  ) { }

  switchChanged(evt: EventData, item: any) {
    const sw = evt.object as Switch;
    this.privacySettings[item.key] = sw.checked;
  }
}
