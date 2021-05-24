import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { GrocySetupComponent } from "./grocy-setup/grocy-setup.component";
import { BarcodeSourcesComponent } from "./barcode-sources/barcode-sources.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { UpcDatabaseConfigComponent } from "../settings/barcode-sources/upc-database-config/upc-database-config.component";

const routes: Routes = [
  { path: "welcome", component: WelcomeComponent },
  { path: "grocy", component: GrocySetupComponent },
  {
    path: "barcode-sources",
    component: BarcodeSourcesComponent,
    children: [
      {
        path: "upcDatabaseConfig",
        component: UpcDatabaseConfigComponent
      }
    ]
  },
  { path: "",   redirectTo: "welcome", pathMatch: "full" }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class SetupWizardRoutingModule { }
