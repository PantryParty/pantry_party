import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptRouterModule } from "nativescript-angular";

import { ProductSelectionComponent } from "~/app/product-selection/product-selection.component";
import { ProductSelectorComponent } from "~/app/product-selection/product-selector.component";
import { ProductCreationComponent } from "~/app/product-creation/product-creation.component";
import { ProductCreatorComponent } from "~/app/product-creation/product-creator.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptUIDataFormModule,
    NativeScriptRouterModule
  ],
  declarations: [
    ProductSelectionComponent,
    ProductSelectorComponent,
    ProductCreatorComponent,
    ProductCreationComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  entryComponents: [
    ProductSelectorComponent,
    ProductCreatorComponent
  ]
})
export class ProductSelectorModule { }
