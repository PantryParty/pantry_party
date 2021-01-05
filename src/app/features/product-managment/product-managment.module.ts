import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ProductManagmentRoutingModule } from "./product-managment-routing.module";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductCreationComponent } from "./product-creation/product-creation.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { AppDrawerOpenerModule } from "~/app/app-drawer-opener/app-drawer-opener.module";
import { PantryPartyFormBuilderModule } from "~/app/utilities/pantry-party-form-builder/pantry-party-form-builder.module";
import { AdWrapperModule } from "~/app/ad-wrapper/ad-wrapper.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

@NgModule({
  declarations: [
    ProductListComponent,
    ProductCreationComponent
  ],
  imports: [
    ProductManagmentRoutingModule,
    NativeScriptCommonModule,
    NativeScriptUIListViewModule,
    NativeScriptUIDataFormModule,
    PantryPartyFormBuilderModule,
    AppDrawerOpenerModule,
    AdWrapperModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProductManagmentModule { }
