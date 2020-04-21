import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SettingsRoutingModule } from "./settings-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { GrocyApiComponent } from "./grocy-api/grocy-api.component";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular/dataform-directives";
import { BarcodeSourcesComponent } from "./barcode-sources/barcode-sources.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { UpcDatabaseConfigComponent } from "./barcode-sources/upc-database-config/upc-database-config.component";
import { PrivacySettingsComponent } from "./privacy-settings/privacy-settings.component";
import { SettingListComponent } from "./setting-list/setting-list.component";
import { AppDrawerOpenerModule } from "~/app/app-drawer-opener/app-drawer-opener.module";
import { GrocyApiWrapperComponent } from "./grocy-api/grocy-api-wrapper.component";
import { BarcodeSourcesWrapperComponent } from "./barcode-sources/barcode-sources-wrapper.component";
import { PrivacySettingsWrapperComponent } from "./privacy-settings/privacy-settings-wrapper.component";

@NgModule({
  declarations: [
    GrocyApiComponent,
    BarcodeSourcesComponent,
    UpcDatabaseConfigComponent,
    PrivacySettingsComponent,
    SettingListComponent,
    GrocyApiWrapperComponent,
    BarcodeSourcesWrapperComponent,
    PrivacySettingsWrapperComponent
  ],
  imports: [
    SettingsRoutingModule,
    NativeScriptCommonModule,
    NativeScriptUIDataFormModule,
    NativeScriptUIListViewModule,
    AppDrawerOpenerModule
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
