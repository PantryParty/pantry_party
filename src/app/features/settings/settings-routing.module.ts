import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { UpcDatabaseConfigComponent } from "./barcode-sources/upc-database-config/upc-database-config.component";

const routes: Routes = [
  {
    path: "settings/barcode-sources/upcDatabaseConfig",
    component: UpcDatabaseConfigComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class SettingsRoutingModule { }
