import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError, of, empty, EMPTY } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";

import { convertToUpcAIfRequired } from "../utilities/upcConverter";
import { ExternalProduct } from "./scanned-item-exernal-lookup.service";
import { getBoolean, setBoolean, setString, getString } from "@nativescript/core/application-settings";

@Injectable({
  providedIn: "root"
})
export class UPCDatabaseService {

  get enabled() {
    return getBoolean("upcDatabase.enabled", false);
  }

  set enabled(val: boolean) {
    setBoolean("upcDatabase.enabled", val);
  }

  get apiKey() {
    return getString("upcDatabase.apiKey", "");
  }

  set apiKey(val: string) {
    setString("upcDatabase.apiKey", val);
  }

  get available() {
    return this.enabled && this.apiKey && !this.receivingErrors;
  }

  get configurationRequired() {
    return this.apiKey === "";
  }

  private receivingErrors = false;

  constructor(private http: HttpClient) { }

  lookForBarcode(barcode: string): Observable<ExternalProduct> {
    if (!this.available) {
      return EMPTY;
    }

    return this.http.post(
      "https://www.upcdatabase.com/xmlrpc",
      `<?xml version="1.0"?>
       <methodCall>
         <methodName>lookup</methodName>
         <params>
           <param>
             <value>
               <struct>
                 <member>
                   <name>rpc_key</name>
                   <value><string>${this.apiKey}</string></value>
                 </member>
                 <member>
                   <name>upc</name>
                   <value><string>${convertToUpcAIfRequired(barcode)}</string></value>
                 </member>
               </struct>
             </value>
           </param>
         </params>
       </methodCall>`,
       { responseType: "text" }
    ) .pipe(
      switchMap(r => this.decodeResponse(r)),
      catchError(() => empty())
    );
  }

  private decodeResponse(doc: string) {
    switch (this.getStringFieldValue(doc, "message")) {
      case "Database entry found":
        return of({ name: this.getStringFieldValue(doc, "description") });
      case "No database entry found.":
        return throwError("Not found");
      case "Invalid credentials":
        this.receivingErrors = true;

        return throwError("Auth Errorx");
      case "":
      default:
        return throwError("Unknown Error");
    }
  }

  private getStringFieldValue(doc: string, fieldName: string): string {
    const regexStr = `<member>\s*<name>${fieldName}</name>\s*<value>\s*<string>([^<]+)</string>`;
    const regex = new RegExp(regexStr, "g");
    const matches = regex.exec(doc);

    return matches[1];
  }

}
