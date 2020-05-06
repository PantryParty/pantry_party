import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NSEmptyOutletComponent } from "nativescript-angular";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ApplicationIsSetup } from "./guards/appIsSetup";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/scan/purchase",
    // redirectTo: "/products/create",
    pathMatch: "full"
  },
  {
    path: "stock",
    loadChildren: () => import("~/app/features/stock/stock.module").then(m => m.StockModule),
    canActivate: [ApplicationIsSetup]
  },
  {
    path: "scan",
    loadChildren: () => import("~/app/features/scan/scan.module").then(m => m.ScanModule),
    canActivate: [ApplicationIsSetup]
  },
  {
    path: "locations",
    loadChildren: () =>
      import("~/app/features/location-managment/location-managment.module")
      .then(m => m.LocationManagmentModule),
    canActivate: [ApplicationIsSetup]
  },
  {
    path: "products",
    loadChildren: () =>
      import("~/app/features/product-managment/product-managment.module")
      .then(m => m.ProductManagmentModule),
    canActivate: [ApplicationIsSetup]
  },
  {
    path: "initialSetup",
    component: NSEmptyOutletComponent,
    loadChildren: () => import("~/app/features/setup-wizard/setup-wizard.module").then(m => m.SetupWizardModule)
  },
  {
    path: "settings",
    component: NSEmptyOutletComponent,
    loadChildren: () => import("~/app/features/settings/settings.module").then(m => m.SettingsModule)
  }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
    providers: [ApplicationIsSetup]
})
export class AppRoutingModule { }
