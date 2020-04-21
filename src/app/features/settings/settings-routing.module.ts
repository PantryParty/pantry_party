import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { UpcDatabaseConfigComponent } from "./barcode-sources/upc-database-config/upc-database-config.component";
import { SettingListComponent } from "./setting-list/setting-list.component";
import { GrocyApiWrapperComponent } from "./grocy-api/grocy-api-wrapper.component";
import { BarcodeSourcesWrapperComponent } from "./barcode-sources/barcode-sources-wrapper.component";
import { PrivacySettingsWrapperComponent } from "./privacy-settings/privacy-settings-wrapper.component";

const routes: Routes = [
  {
    path: "",
    component: SettingListComponent
  },
  {
    path: "grocy",
    component: GrocyApiWrapperComponent
  },
  {
    path: "privacy",
    component: PrivacySettingsWrapperComponent
  },
  {
    path: "barcode-sources/upcDatabaseConfig",
    component: UpcDatabaseConfigComponent
  },
  {
    path: "barcode-sources",
    component: BarcodeSourcesWrapperComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class SettingsRoutingModule { }
