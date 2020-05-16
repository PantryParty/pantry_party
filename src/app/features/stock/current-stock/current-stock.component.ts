import { Component, ViewChild, ViewContainerRef, ElementRef  } from "@angular/core";
import { GrocyStockEntry } from "~/app/services/grocy.interfaces";
import { GrocyService } from "~/app/services/grocy.service";
import { ListViewEventData } from "nativescript-ui-listview";
import { StockFilterComponent } from "../stock-filter/stock-filter.component";
import { BottomSheetService, BottomSheetOptions } from "nativescript-material-bottomsheet/angular";
import { SearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { relativeDate } from "~/app/utilities/dateString";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { StockActionSheetComponent } from "../stock-action-sheet/stock-action-sheet.component";

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

  private lastFilterData = {
    productNameContains: "",
    showChildProducts: false,
    showOnlyBelowMinStock: false,
    withinDaysOfExpiration: "",
    includeOpenAsOutOfStock: true,
    onlyShowOutOfStock: false,
    belowMinQuantity: false
  };

  constructor(
    private grocyService: GrocyService,
    private bottomSheet: BottomSheetService,
    private containerRef: ViewContainerRef,
    private stateTransfer: StateTransferService
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
    this.filteredStockItems = this.allStock.filter(s => this.stockItemMatches(s));
  }

  bestBeforeDate(item: GrocyStockEntry) {
    return item.best_before_date.toDateString();
  }

  openFilter() {
    const options: BottomSheetOptions = {
      viewContainerRef: this.containerRef,
      animated: true,
      dismissOnBackgroundTap: true,
      dismissOnDraggingDownSheet: true
    };

    this.stateTransfer.setState({
      type: "stockFilter",
      currentFilters: this.lastFilterData,
      callback: s => {
        this.lastFilterData = {
          ...this.lastFilterData,
          ...s
        };
        this.filterStock();
      }
    });

    this.bottomSheet.show(StockFilterComponent, options);
  }

  stockItemMatches(item: GrocyStockEntry) {
    if (
      this.lastFilterData.productNameContains.length > 0 &&
      !item.product.name.toLowerCase().includes(this.lastFilterData.productNameContains.toLowerCase())
    ) {
      return false;
    }

    if (
      !this.lastFilterData.showChildProducts &&
      item.product.parent_product_id
    ) { return false; }

    if (this.lastFilterData.withinDaysOfExpiration !== "") {
      console.log("max days", this.lastFilterData.withinDaysOfExpiration);

      const maximumDate = relativeDate(Number(this.lastFilterData.withinDaysOfExpiration));

      if (item.best_before_date > maximumDate) {
        return false;
      }
    }

    if (this.lastFilterData.showOnlyBelowMinStock || this.lastFilterData.onlyShowOutOfStock) {
      const stock = item.amount_aggregated - (
        this.lastFilterData.includeOpenAsOutOfStock ? item.amount_opened_aggregated : 0
      );

      if (
        this.lastFilterData.showOnlyBelowMinStock && item.product.min_stock_amount < stock
      ) {
        return false;
      }

      if (
        this.lastFilterData.onlyShowOutOfStock && stock > 0
      ) {
        return false;
      }

    }

    return true;
  }

  searchUpdated($evt: any) {
    this.lastFilterData.productNameContains = ($evt.object as SearchBar).text;
    this.filterStock();
  }

  childrenOf(item: GrocyStockEntry) {
    return this.allStock.filter(i => i.product.parent_product_id === item.product.id);
  }

  selectListEntry($event: ItemEventData) {
    const options: BottomSheetOptions = {
      viewContainerRef: this.containerRef,
      animated: true,
      dismissOnBackgroundTap: true,
      dismissOnDraggingDownSheet: true
    };

    const item  = this.filteredStockItems[$event.index];
    this.stateTransfer.setState({
      type: "stockItemManager",
      stockItem: item,
      childStockItems: this.childrenOf(item)
    });

    this.bottomSheet.show(StockActionSheetComponent, options);
  }
}
