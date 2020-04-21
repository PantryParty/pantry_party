import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NSEmptyOutletComponent } from "nativescript-angular";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ApplicationIsSetup } from "./guards/appIsSetup";

const routes: Routes = [
  {
    path: "",
//    redirectTo: "/scan/purchase",
    redirectTo: "/settings",
    pathMatch: "full"
  },
  {
    path: "scan",
    loadChildren: () => import("~/app/features/scan/scan.module").then((m) => m.ScanModule),
    canActivate: [ApplicationIsSetup]
  },
  {
    path: "initialSetup",
    component: NSEmptyOutletComponent,
    loadChildren: () => import("~/app/features/setup-wizard/setup-wizard.module").then((m) => m.SetupWizardModule)
  },
  {
    path: "settings",
    component: NSEmptyOutletComponent,
    loadChildren: () => import("~/app/features/settings/settings.module").then((m) => m.SettingsModule)
  }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
    providers: [ApplicationIsSetup]
})
export class AppRoutingModule { }
