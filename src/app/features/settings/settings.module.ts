import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SettingsRoutingModule } from "./settings-routing.module";
import { GrocyApiComponent } from "./grocy-api/grocy-api.component";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { BarcodeSourcesComponent } from "./barcode-sources/barcode-sources.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { UpcDatabaseConfigComponent } from "./barcode-sources/upc-database-config/upc-database-config.component";
import { PrivacySettingsComponent } from "./privacy-settings/privacy-settings.component";
import { SettingListComponent } from "./setting-list/setting-list.component";
import { AppDrawerOpenerModule } from "~/app/app-drawer-opener/app-drawer-opener.module";
import { GrocyApiWrapperComponent } from "./grocy-api/grocy-api-wrapper.component";
import { BarcodeSourcesWrapperComponent } from "./barcode-sources/barcode-sources-wrapper.component";
import { PrivacySettingsWrapperComponent } from "./privacy-settings/privacy-settings-wrapper.component";
import { NativeScriptCommonModule, NativeScriptFormsModule } from "@nativescript/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { PantryPartyFormBuilderModule } from "~/app/utilities/pantry-party-form-builder/pantry-party-form-builder.module";
import { ExternalScannerSettingsComponent } from "./external-scanner/component";
import { ExternalScannerCaptureModule } from "~/app/external-scanner-capture/external-scanner-capture.module";

@NgModule({
  declarations: [
    GrocyApiComponent,
    BarcodeSourcesComponent,
    UpcDatabaseConfigComponent,
    PrivacySettingsComponent,
    SettingListComponent,
    GrocyApiWrapperComponent,
    BarcodeSourcesWrapperComponent,
    PrivacySettingsWrapperComponent,
    ExternalScannerSettingsComponent
  ],
  imports: [
    SettingsRoutingModule,
    NativeScriptCommonModule,
    NativeScriptUIDataFormModule,
    NativeScriptUIListViewModule,
    AppDrawerOpenerModule,
    ReactiveFormsModule,
    NativeScriptFormsModule,
    PantryPartyFormBuilderModule,
    ExternalScannerCaptureModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    GrocyApiComponent,
    BarcodeSourcesComponent,
    UpcDatabaseConfigComponent,
    PrivacySettingsComponent
  ]
})
export class SettingsModule { }
