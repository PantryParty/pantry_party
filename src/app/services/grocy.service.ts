import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { getString, setString } from "tns-core-modules/application-settings";

import {
  GrocyProduct,
  GrocyLocation,
  GrocyQuantityUnit,
  GrocyItemCreated,
  GrocyProductAPIReturn,
  GrocyStockAPIReturn,
  GrocyStockEntry,
  GrocyVolatileReturn
} from "./grocy.interfaces";

import { Observable, of, forkJoin, BehaviorSubject } from "rxjs";
import { map, exhaustMap, mapTo, switchMap, tap, filter } from "rxjs/operators";
import { dateStringParser } from "../utilities/dateStringParser";
import {GrocyV2Service} from "./grocy-v2.service";
import {GrocyV3Service} from "./grocy-v3.service";

export interface OpenProductsParams {
  productId: number | string;
  quantity: number;
}

export interface ConsumeProductsParams {
  productId: number | string;
  quantity: number;
  spoiled: boolean;
  locationId?: string | number;
}

interface CreateProductParams {
  name: string;
  description: string;
  location_id: string | number;
  quantity_unit_id_purchase: number;
  quantity_unit_id_stock: number;
  quantity_unit_factor_purchase_to_stock: number;
  barcodes: string[];
  min_stock_amount: number;
  default_best_before_days: number;
  default_best_before_days_after_open: number;
  default_best_before_days_after_thawing: number;
  default_best_before_days_after_freezing: number;
  cumulate_min_stock_amount_of_sub_products?: boolean;
  parent_product_id?: string | number;
}

export interface PurchaseProductsParams {
  productId: number | string;
  quantity: number;
  bestBeforeDate: string;
  locationId?: number | string;
}

export interface GrocySystemInfoResponse {
  grocy_version: { Version: string; };
}

export interface InventoryProductsParams  {
  new_amount: number;
  best_before_date: string;
  location_id: string | number;
}

interface Version {
  major: number;
  minor: number;
  patch: number;
}

const defaultVersion = {major: 0, minor: 0, patch: 0};

@Injectable({
  providedIn: "root"
})
export class GrocyService {
  apiVersion: BehaviorSubject<Version> = new BehaviorSubject(defaultVersion);

  get apiHost() {
    return getString("grocy.apiHost", "");
  }
  set apiHost(value) {
    this.apiVersion.next(defaultVersion);
    setString("grocy.apiHost", value);
  }

  get apiKey() {
    return getString("grocy.apiKey", "");
  }
  set apiKey(value) {
    this.apiVersion.next(defaultVersion);
    setString("grocy.apiKey", value);
  }

  constructor(
    private http: HttpClient,
    private grocyv2: GrocyV2Service,
    private grocyv3: GrocyV3Service
  ) { }

  getSystemInfo(host = this.apiHost, key = this.apiKey) {
    return this.http.get<GrocySystemInfoResponse>(
      `${host}/system/info`,
      { headers: {"GROCY-API-KEY": key} }
    );
  }

  version() {
    return this.apiVersion.pipe(
      tap(r => {
        if (r === defaultVersion) {
          this.updateVersion();
        }
      }),
      filter(r => r !== defaultVersion)
    );
  }

  updateVersion() {
    this.getSystemInfo().pipe(
      map(r => r.grocy_version.Version),
      map(r => {
        const parts = r.split(".");

        return {major: +parts[0], minor: +parts[1], patch: +parts[2]};
      })
    ).subscribe(r => this.apiVersion.next(r));
  }

  searchForBarcode(barcode: string): Observable<GrocyProduct> {
    return this.adapter.pipe(switchMap(a => a.searchForBarcode(barcode)));
  }

  quantityUnits(): Observable<GrocyQuantityUnit[]> {
    return this.adapter.pipe(switchMap(a => a.quantityUnits()));
  }

  getLocation(locationId: number): Observable<GrocyLocation> {
    return this.adapter.pipe(switchMap(a => a.getLocation(locationId)));
  }

  locations(): Observable<GrocyLocation[]> {
    return this.adapter.pipe(switchMap(a => a.locations()));
  }

  getProduct(id: string | number): Observable<GrocyProduct> {
    return this.adapter.pipe(switchMap(a => a.getProduct(id)));
  }

  addBarcodeToProduct(productId: string | number, newBarcode: string): Observable<boolean> {
    return this.adapter.pipe(switchMap(a => a.addBarcodeToProduct(productId, newBarcode)));
  }

  searchProducts(term: string): Observable<GrocyProduct[]> {
    return this.adapter.pipe(switchMap(a => a.searchProducts(term)));
  }

  allProducts(): Observable<GrocyProduct[]> {
    return this.adapter.pipe(switchMap(a => a.allProducts()));
  }

  createProduct(productParams: CreateProductParams): Observable<GrocyProduct> {
    return this.adapter.pipe(switchMap(a => a.createProduct(productParams)));
  }

  createLocation(name: string, description: string, isFreezer: boolean): Observable<GrocyLocation> {
    return this.adapter.pipe(switchMap(a => a.createLocation(name, description, isFreezer)));
  }

  undoBooking(transactionId: string) {
    return this.adapter.pipe(switchMap(a => a.undoBooking(transactionId)));
  }

  undoTransaction(transactionId: string) {
    return this.adapter.pipe(switchMap(a => a.undoTransaction(transactionId)));
  }

  openProduct(openParams: OpenProductsParams) {
    return this.adapter.pipe(switchMap(a => a.openProduct(openParams)));
  }

  consumeProduct(consumeParams: ConsumeProductsParams) {
    return this.adapter.pipe(switchMap(a => a.consumeProduct(consumeParams)));
  }

  inventoryProduct(productId: string | number , inventoryParams: InventoryProductsParams) {
    return this.adapter.pipe(switchMap(a => a.inventoryProduct(productId, inventoryParams)));
  }

  purchaseProduct(purchaseProduct: PurchaseProductsParams) {
    return this.adapter.pipe(switchMap(a => a.purchaseProduct(purchaseProduct)));
  }

  inStockItems(): Observable<GrocyStockEntry[]> {
    return this.adapter.pipe(switchMap(a => a.inStockItems()));
  }

  allStock(): Observable<GrocyStockEntry[]> {
    return this.adapter.pipe(switchMap(a => a.allStock()));
  }

  outOfStockStock(): Observable<GrocyStockEntry[]> {
    return this.adapter.pipe(switchMap(a => a.outOfStockStock()));
  }

  get adapter() {
    return this.version().pipe(
      map(r => r.major === 2 ? this.grocyv2 : this.grocyv3)
    );
  }
}
