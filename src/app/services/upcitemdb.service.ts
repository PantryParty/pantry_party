import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, EMPTY } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";

import { convertToUpcAIfRequired } from "../utilities/upcConverter";
import { ExternalProduct } from "./scanned-item-exernal-lookup.service";
import { getBoolean, setBoolean } from "@nativescript/core/application-settings";

interface ItemLookupResponse {
  items: {
    title: string;
    brand: string;
  }[];
}
@Injectable({
  providedIn: "root"
})
export class UPCItemDbService {
  get enabled() {
    return getBoolean("upcitemdb.enabled", true);
  }

  set enabled(val: boolean) {
    setBoolean("upcitemdb.enabled", val);
  }

  configurationRequired = false;
  constructor(private http: HttpClient) { }

  lookForBarcode(barcode: string): Observable<ExternalProduct> {
    if (!this.enabled) {
      return EMPTY;
    }

    return this.http.get<ItemLookupResponse>(
      "https://api.upcitemdb.com/prod/trial/lookup",
      {
        params: {
          upc: convertToUpcAIfRequired(barcode)
        }
      }
    ) .pipe(
      catchError(() => EMPTY),
      switchMap(r => {
      if (r.items.length === 0) {
        return EMPTY;
      } else {
        let name = r.items[0].title;

        if (r.items[0].brand) {
          name += ` (${r.items[0].brand})`;
        }

        return of({ name });
      }
    })
    );
  }

}
