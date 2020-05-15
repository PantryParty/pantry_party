import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { StockRoutingModule } from "./stock-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { CurrentStockComponent } from "./current-stock/current-stock.component";
import { AppDrawerOpenerModule } from "~/app/app-drawer-opener/app-drawer-opener.module";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular/listview-directives";
import { StockFilterComponent } from "./stock-filter/stock-filter.component";
import { NativeScriptFormsModule } from "nativescript-angular";
import { ReactiveFormsModule } from "@angular/forms";
import { StockActionSheetComponent } from "./stock-action-sheet/stock-action-sheet.component";

@NgModule({
  declarations: [CurrentStockComponent, StockFilterComponent, StockActionSheetComponent],
  imports: [
    StockRoutingModule,
    NativeScriptCommonModule,
    AppDrawerOpenerModule,
    NativeScriptUIListViewModule,
    NativeScriptFormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    StockFilterComponent,
    StockActionSheetComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StockModule { }
