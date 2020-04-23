import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ProductManagmentRoutingModule } from "./product-managment-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductCreationComponent } from "./product-creation/product-creation.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular/listview-directives";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular/dataform-directives";

@NgModule({
  declarations: [
    ProductListComponent,
    ProductCreationComponent
  ],
  imports: [
    ProductManagmentRoutingModule,
    NativeScriptCommonModule,
    NativeScriptUIListViewModule,
    NativeScriptUIDataFormModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProductManagmentModule { }
