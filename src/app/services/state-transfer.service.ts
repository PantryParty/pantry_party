import { Injectable } from "@angular/core";
import { GrocyLocation } from "./grocy.interfaces";

interface LocationSelection {
  type: "locationSelection";
  callback: (x: {created: boolean, location: GrocyLocation}) => any;
}

interface LocationCreation {
  type: "locationCreation";
  callback: (x: GrocyLocation) => any;
}

type AvailableTypes = null | LocationSelection | LocationCreation;

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
