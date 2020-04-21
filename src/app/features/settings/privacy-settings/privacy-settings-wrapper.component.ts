import { Component } from "@angular/core";
import { PrivacyService } from "~/app/services/privacy.service";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { EventData } from "tns-core-modules/ui/page/page";

@Component({
  selector: "ns-privacy-settings-wrapper",
  template: `
    <ActionBar title="Privacy Settings">
      <NavigationButton></NavigationButton>
    </ActionBar>
    <ns-privacy-settings></ns-privacy-settings>
  `
})
export class PrivacySettingsWrapperComponent {

}
