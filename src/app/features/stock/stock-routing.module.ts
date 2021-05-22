import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { CurrentStockComponent } from "./current-stock/current-stock.component";

const routes: Routes = [
  {
    path: "",
    component: CurrentStockComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class StockRoutingModule { }
