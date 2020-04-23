import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { PurchaseComponent } from "../purchase/purchase.component";
import { OpenComponent } from "../open/open.component";
import { SpoiledComponent } from "../spoiled/spoiled.component";
import { ConsumeComponent } from "../consume/consume.component";

const routes: Routes = [
  {
    path: "purchase",
    component: PurchaseComponent
  },
  {
    path: "open",
    component: OpenComponent
  },
  {
    path: "spoiled",
    component: SpoiledComponent
  },
  {
    path: "consume",
    component: ConsumeComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ScanRoutingModule { }
