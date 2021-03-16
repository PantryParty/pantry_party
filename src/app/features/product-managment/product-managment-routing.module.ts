import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductCreationComponent } from "./product-creation/product-creation.component";

const routes: Routes = [
  {
    path: "",
    component: ProductListComponent
  },
  {
    path: "create",
    component: ProductCreationComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ProductManagmentRoutingModule { }
