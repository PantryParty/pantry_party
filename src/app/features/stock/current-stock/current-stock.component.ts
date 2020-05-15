import { Component, ViewChild  } from "@angular/core";
import { GrocyStockEntry } from "~/app/services/grocy.interfaces";
import { GrocyService } from "~/app/services/grocy.service";
import { ListViewEventData } from "nativescript-ui-listview";
import { StockFilterComponent } from "../stock-filter/stock-filter.component";

@Component({
  selector: "ns-current-stock",
  templateUrl: "./current-stock.component.html",
  styleUrls: ["./current-stock.component.scss"]
})
export class CurrentStockComponent {
  @ViewChild(StockFilterComponent, { static: false }) stockFilter: StockFilterComponent;

  get lastSearch() {
    return this._lastSearch;
  }
  set lastSearch(value) {
    this._lastSearch = value;
    this.filterStock();
  }

  get allStock(): GrocyStockEntry[] {
    return this._allStock;
  }
  set allStock(value: GrocyStockEntry[]) {
    this._allStock = value;
    this.filterStock();
  }

  filteredStockItems: GrocyStockEntry[] = [];

  private _lastSearch = "";
  private _allStock: GrocyStockEntry[] = [];

  constructor(
    private grocyService: GrocyService
  ) {
    this.getNewStock();
  }

  getNewStock() {
    return this.grocyService.allStock().subscribe(r => this.allStock = r);
  }

  quantityStringForStockItem(item: GrocyStockEntry) {
    let str = `${item.amount_aggregated} In Stock`;

    if (item.amount_opened_aggregated > 0) {
      str += ` of which ${item.amount_opened_aggregated} are opened`;
    }

    return str;
  }

  listPulled(evt: ListViewEventData) {
    this.getNewStock().add(_ => evt.object.notifyPullToRefreshFinished());
  }

  filterStock() {
    this.filteredStockItems = this.allStock.filter(s => this.stockFilter.stockItemMatches(s));
  }

  bestBeforeDate(item: GrocyStockEntry) {
    return item.best_before_date.toDateString();
  }

}
