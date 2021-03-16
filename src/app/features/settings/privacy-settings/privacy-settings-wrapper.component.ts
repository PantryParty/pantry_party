import { Component } from "@angular/core";
import { PrivacyService } from "~/app/services/privacy.service";
import { Switch } from "@nativescript/core";
import { EventData } from "@nativescript/core";

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
