import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ScannedItemEditorComponent } from "./scanned-item-editor/scanned-item-editor.component";
import { ProductQuickCreateComponent } from "./product-quick-create/product-quick-create.component";

const routes: Routes = [
  {
    path: "editScannedItem",
    component: ScannedItemEditorComponent
  },
  {
    path: "quickCreateProducts",
    component: ProductQuickCreateComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ScannedItemSetRoutingModule { }
