import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule} from "nativescript-angular/router";
import { PurchaseComponent } from "../purchase/purchase.component";
import { SCANNED_ITEM_EDITOR_ROUTES } from "~/app/scanned-item-set/scanned-item-editor/scanned-item-editor.routes";
import { OpenComponent } from "../open/open.component";
import { SpoiledComponent } from "../spoiled/spoiled.component";
import { ConsumeComponent } from "../consume/consume.component";

const routes: Routes = [
  {
    path: "purchase",
    component: PurchaseComponent,
    children: [
      ...SCANNED_ITEM_EDITOR_ROUTES
    ]
  },
  {
    path: "open",
    component: OpenComponent,
    children: [
      ...SCANNED_ITEM_EDITOR_ROUTES
    ]
  },
  {
    path: "spoiled",
    component: SpoiledComponent,
    children: [
      ...SCANNED_ITEM_EDITOR_ROUTES
    ]
  },
  {
    path: "consume",
    component: ConsumeComponent,
    children: [
      ...SCANNED_ITEM_EDITOR_ROUTES
    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ScanRoutingModule { }
