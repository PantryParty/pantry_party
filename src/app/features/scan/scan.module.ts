import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ScanRoutingModule } from "./scan-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { ScanSelectorModule } from "~/app/scan-selector/scan-selector.module";
import { ScanedItemEditorModule } from "~/app/scanned-item-set/scanned-item-editor/scanned-item-editor.module";
import { ScannedItemSetModule } from "~/app/scanned-item-set/scanned-item-set.module";
import { PurchaseComponent } from "../purchase/purchase.component";
import { OpenComponent } from "../open/open.component";
import { SpoiledComponent } from "../spoiled/spoiled.component";
import { ConsumeComponent } from "../consume/consume.component";
import { AppDrawerOpenerModule } from "~/app/app-drawer-opener/app-drawer-opener.module";
import { InventoryComponent } from "../inventory/inventory.component";

@NgModule({
  declarations: [
    PurchaseComponent,
    OpenComponent,
    SpoiledComponent,
    ConsumeComponent,
    InventoryComponent
  ],
  imports: [
    ScanRoutingModule,
    NativeScriptCommonModule,
    ScanSelectorModule,
    ScannedItemSetModule,
    ScanedItemEditorModule,
    AppDrawerOpenerModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ScanModule { }
