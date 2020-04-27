import { Injectable } from "@angular/core";
import { Observable, concat, throwError } from "rxjs";
import { OpenFoodFactsService } from "~/app/services/openfoodfacts.service";
import { UPCDatabaseService } from "~/app/services/upcdatabase.service";
import { map, take } from "rxjs/operators";
import { UPCItemDbService } from "./upcitemdb.service";
import { setString, getString } from "tns-core-modules/application-settings/application-settings";

export interface ExternalProduct {
  name: string;
}
@Injectable({
  providedIn: "root"
})
export class ScannedItemExernalLookupService {

  get lookupOrder(): string[] {
    const v = getString("scannedItemExternalLookupService.order", '["openFoodFacts", "upcItemDb", "upcDb"]');

    return JSON.parse(v);
  }

  set lookupOrder(s: string[]) {
    setString("scannedItemExternalLookupService.order", JSON.stringify(s));
  }

  constructor(
    private openFoodFacts: OpenFoodFactsService,
    private upcItemDbService: UPCItemDbService,
    private upcDatabase: UPCDatabaseService
  ) { }

  search(barcode: string): Observable<ExternalProduct> {
    return concat(
      ...this.lookupOrder.map(i => this.searchForType(i, barcode)),
      throwError("No Prouct Found")
    ).pipe(take(1));
  }

  searchForType(type: string, barcode: string): Observable<ExternalProduct> {
    switch (type) {
      case "openFoodFacts":
        return this.openFoodFacts.searchForBarcode(barcode);
      case "upcItemDb":
        return this.upcItemDbService.lookForBarcode(barcode);
      case "upcDb":
        return this.upcDatabase.lookForBarcode(barcode);
    }
  }
}
