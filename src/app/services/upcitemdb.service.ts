import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, EMPTY } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";

import { convertToUpcAIfRequired } from "../utilities/upcConverter";
import { ExternalProduct } from "./scanned-item-exernal-lookup.service";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings/application-settings";

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

    return this.http.get<{items: {title: string}[]}>(
      "https://api.upcitemdb.com/prod/trial/lookup",
      {
        params: {
          upc: convertToUpcAIfRequired(barcode)
        }
      }
    ) .pipe(
      catchError(() => EMPTY),
      switchMap((r) => {
      if (r.items.length === 0) {
        return EMPTY;
      } else {
        return of({
          name: r.items[0].title
        });
      }
    })
    );
  }

}
