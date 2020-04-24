import { Injectable } from "@angular/core";
import { GrocyLocation, GrocyProduct } from "./grocy.interfaces";
import { ProductSelectionResults } from "../features/product-managment/product-list/product-list.component";
import { LocationSelectionResults } from "../features/location-managment/location-list/location-list.component";
import { ScannedItem } from "../scanned-item-set/services/scanned-item-manager.service";
import { ScannedItemEditorCallback } from "../scanned-item-set/scanned-item-editor/scanned-item-editor.component";

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

type AvailableTypes = null
  | LocationSelection
  | LocationCreation
  | ProductCreation
  | ProductSelection
  | ScannedItemEditor
  ;

@Injectable({
  providedIn: "root"
})
export class StateTransferService {
  passedData: AvailableTypes = null;

  setState(v: AvailableTypes) {
    this.passedData = v;
  }

  readAndClearState() {
    const val = this.passedData;
    this.passedData = null;

    return val;
  }
}
