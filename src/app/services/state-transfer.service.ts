import { Injectable } from "@angular/core";
import { GrocyLocation, GrocyProduct, GrocyStockEntry } from "./grocy.interfaces";
import { ProductSelectionResults } from "../features/product-managment/product-list/product-list.component";
import { LocationSelectionResults } from "../features/location-managment/location-list/location-list.component";
import { ScannedItem, ScannedItemManagerService } from "../scanned-item-set/services/scanned-item-manager.service";
import { ScannedItemEditorCallback } from "../scanned-item-set/scanned-item-editor/scanned-item-editor.component";
import { StockFilters } from "../features/stock/stock-filter/stock-filter.component";

interface StockItemManageState {
  type: "stockItemManager";
  stockItem: GrocyStockEntry;
}

interface StockFiltersState {
  type: "stockFilter";
  currentFilters?: StockFilters;
  callback: (f: StockFilters) => any;
}

interface LocationSelection {
  type: "locationSelection";
  callback: (x: LocationSelectionResults) => any;
}

interface LocationCreation {
  type: "locationCreation";
  callback: (x: GrocyLocation) => any;
}

interface ProductCreation {
  type: "productCreation";
  forScannedItem?: ScannedItem;
  callback: (x: GrocyProduct) => any;
}

interface ProductSelection {
  type: "productSelection";
  forScannedItem?: ScannedItem;
  callback: (x: ProductSelectionResults) => any;
}

interface ScannedItemEditor {
  type: "scannedItemEdit";
  scannedItem: ScannedItem;
  callback: ScannedItemEditorCallback;
}

interface ProductQuickCreate {
  type: "productQuickCreate";
  scannedItemManager: ScannedItemManagerService;
  scannedItems: ScannedItem[];
}

type AvailableTypes = null
  | LocationCreation
  | LocationSelection
  | ProductCreation
  | ProductQuickCreate
  | ProductSelection
  | ScannedItemEditor
  | StockFiltersState
  | StockItemManageState
  ;

@Injectable({
  providedIn: "root"
})
export class StateTransferService {
  private passedData: AvailableTypes = null;

  setState(v: AvailableTypes) {
    this.passedData = v;
  }

  readAndClearState() {
    const val = this.passedData;
    this.passedData = null;

    return val;
  }
}
