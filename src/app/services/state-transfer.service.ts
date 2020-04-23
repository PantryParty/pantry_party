import { Injectable } from "@angular/core";
import { GrocyLocation, GrocyProduct } from "./grocy.interfaces";
import { ProductSelectionResults } from "../features/product-managment/product-list/product-list.component";
import { LocationSelectionResults } from "../features/location-managment/location-list/location-list.component";

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
  callback: (x: GrocyProduct) => any;
}

interface ProductSelection {
  type: "productSelection";
  callback: (x: ProductSelectionResults) => any;
}

type AvailableTypes = null
  | LocationSelection
  | LocationCreation
  | ProductCreation
  | ProductSelection
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
