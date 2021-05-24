import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SetupWizardRoutingModule } from "./setup-wizard-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { GrocySetupComponent } from "./grocy-setup/grocy-setup.component";
import { SettingsModule } from "../settings/settings.module";
import { BarcodeSourcesComponent } from "./barcode-sources/barcode-sources.component";
import { WelcomeComponent } from "./welcome/welcome.component";

@NgModule({
  declarations: [
    GrocySetupComponent,
    BarcodeSourcesComponent,
    WelcomeComponent,
  ],
  imports: [
    SetupWizardRoutingModule,
    NativeScriptCommonModule,
    SettingsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SetupWizardModule { }
