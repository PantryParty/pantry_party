import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { StockRoutingModule } from "./stock-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { CurrentStockComponent } from "./current-stock/current-stock.component";
import { AppDrawerOpenerModule } from "~/app/app-drawer-opener/app-drawer-opener.module";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular/listview-directives";

@NgModule({
  declarations: [CurrentStockComponent],
  imports: [
    StockRoutingModule,
    NativeScriptCommonModule,
    AppDrawerOpenerModule,
    NativeScriptUIListViewModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StockModule { }
