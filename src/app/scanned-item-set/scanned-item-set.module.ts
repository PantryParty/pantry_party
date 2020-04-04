import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { ScannedItemSetComponent } from "~/app/scanned-item-set/scanned-item-set.component";
import { ScannedItemListComponent } from "./scanned-item-list/scanned-item-list.component";
import { ScannedItemDisplayComponent } from "./scanned-item-display/scanned-item-display.component";
import { LocationSelectorModule } from "~/app/location-selection/location-selector.module";
import { ProductSelectorModule } from "../product-selection/product-selector.module";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    LocationSelectorModule,
    ProductSelectorModule
  ],
  declarations: [
    ScannedItemSetComponent,
    ScannedItemListComponent,
    ScannedItemDisplayComponent
  ],
  exports: [
    ScannedItemSetComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ScannedItemSetModule { }
