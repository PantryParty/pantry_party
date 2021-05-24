import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { UpcDatabaseConfigComponent } from "./barcode-sources/upc-database-config/upc-database-config.component";
import { SettingListComponent } from "./setting-list/setting-list.component";
import { GrocyApiWrapperComponent } from "./grocy-api/grocy-api-wrapper.component";
import { BarcodeSourcesWrapperComponent } from "./barcode-sources/barcode-sources-wrapper.component";
import { ExternalScannerSettingsComponent } from "./external-scanner/component";

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
    path: "barcode-sources/upcDatabaseConfig",
    component: UpcDatabaseConfigComponent
  },
  {
    path: "barcode-sources",
    component: BarcodeSourcesWrapperComponent
  },
  {
    path: "external-scanner",
    component: ExternalScannerSettingsComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class SettingsRoutingModule { }
