import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { ScannedItemSetComponent } from "~/app/scanned-item-set/scanned-item-set.component";
import { ScannedItemListComponent } from "./scanned-item-list/scanned-item-list.component";
import { ScannedItemDisplayComponent } from "./scanned-item-display/scanned-item-display.component";
import { ScannedItemSetRoutingModule } from "./scanned-item-set.routing";
import { ProductQuickCreateComponent } from "./product-quick-create/product-quick-create.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { DateIncrementerComponent } from './product-quick-create/date-incrementer/date-incrementer.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    ScannedItemSetRoutingModule,
    NativeScriptFormsModule
  ],
  declarations: [
    ScannedItemSetComponent,
    ScannedItemListComponent,
    ScannedItemDisplayComponent,
    ProductQuickCreateComponent,
    DateIncrementerComponent
  ],
  exports: [
    ScannedItemSetComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ScannedItemSetModule { }
