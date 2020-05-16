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

import { Observable, of, forkJoin } from "rxjs";
import { map, exhaustMap, mapTo, switchMap } from "rxjs/operators";
import { dateStringParser } from "../utilities/dateStringParser";

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

@Injectable({
  providedIn: "root"
})
export class GrocyService {
  get apiHost() {
    return getString("grocy.apiHost", "");
  }
  set apiHost(value) {
    setString("grocy.apiHost", value);
  }

  get apiKey() {
    return getString("grocy.apiKey", "");
  }
  set apiKey(value) {
    setString("grocy.apiKey", value);
  }

  constructor(
    private http: HttpClient
  ) { }

  getSystemInfo(host = this.apiHost, key = this.apiKey) {
    return this.http.get<GrocySystemInfoResponse>(
      `${host}/system/info`,
      { headers: {"GROCY-API-KEY": key} }
    );
  }

  searchForBarcode(barcode: string): Observable<GrocyProduct> {
    return this.http.get<{product: GrocyProductAPIReturn}>(
      `${this.apiHost}/stock/products/by-barcode/${barcode}`,
      { headers: {"GROCY-API-KEY": this.apiKey} }
    ).pipe(
      map(i => this.convertProductApiToLocal(i.product))
    );
  }

  quantityUnits(): Observable<GrocyQuantityUnit[]> {
    return this.http.get<GrocyQuantityUnit[]>(
      `${this.apiHost}/objects/quantity_units`,
      { headers: {"GROCY-API-KEY": this.apiKey} }
    );
  }

  getLocation(locationId: number): Observable<GrocyLocation> {
    return this.http.get<GrocyLocation>(
      `${this.apiHost}/objects/locations/${locationId}`,
      { headers: {"GROCY-API-KEY": this.apiKey} }
    );
  }

  locations(): Observable<GrocyLocation[]> {
    return this.http.get<GrocyLocation[]>(
      `${this.apiHost}/objects/locations`,
      { headers: {"GROCY-API-KEY": this.apiKey} }
    );
  }

  getProduct(id: string | number): Observable<GrocyProduct> {
    return this.http.get<GrocyProductAPIReturn>(
      `${this.apiHost}/objects/products/${id}`,
      { headers: {"GROCY-API-KEY": this.apiKey} }
    ).pipe(
      map(this.convertProductApiToLocal)
    );
  }

  addBarcodeToProduct(productId: string | number, newBarcode: string): Observable<boolean> {
    return this.getProduct(productId).pipe(
      exhaustMap(product => {
        if (product.barcodes.indexOf(newBarcode) > -1) {
          return of(true);
        } else {
          return this.http.put(
            `${this.apiHost}/objects/products/${productId}`,
            { barcode:  product.barcodes.concat([newBarcode]).join(",")},
            { headers: {"GROCY-API-KEY": this.apiKey} }
          ).pipe(mapTo(true));
        }
      })
    );
  }

  searchProducts(term: string): Observable<GrocyProduct[]> {
    return this.http.get<GrocyProductAPIReturn[]>(
      `${this.apiHost}/objects/products/search/${term}`,
      { headers: {"GROCY-API-KEY": this.apiKey} }
    ).pipe(
      map(r => r.map(this.convertProductApiToLocal))
    );
  }

  allProducts(): Observable<GrocyProduct[]> {
    return this.http.get<GrocyProductAPIReturn[]>(
      `${this.apiHost}/objects/products`,
      { headers: {"GROCY-API-KEY": this.apiKey} }
    ).pipe(
      map(r => r.map(this.convertProductApiToLocal))
    );
  }

  createProduct(productParams: CreateProductParams): Observable<GrocyProduct> {
    return this.http.post<GrocyItemCreated>(
      `${this.apiHost}/objects/products`,
      {
        name: productParams.name,
        description: productParams.description,
        location_id: productParams.location_id,
        qu_id_purchase: productParams.quantity_unit_id_purchase,
        qu_id_stock: productParams.quantity_unit_id_stock,
        qu_factor_purchase_to_stock: productParams.quantity_unit_factor_purchase_to_stock,
        barcode: productParams.barcodes.join(","),
        min_stock_amount: productParams.min_stock_amount,
        default_best_before_days: productParams.default_best_before_days,
        default_best_before_days_after_open: productParams.default_best_before_days_after_open,
        default_best_before_days_after_thawing: productParams.default_best_before_days_after_thawing,
        default_best_before_days_after_freezing: productParams.default_best_before_days_after_freezing,
        cumulate_min_stock_amount_of_sub_products: productParams.cumulate_min_stock_amount_of_sub_products,
        parent_product_id: productParams.parent_product_id
      },
      { headers: {"GROCY-API-KEY": this.apiKey} }
    ).pipe(
      map(r => ({
        ...productParams,
        location_id: Number(productParams.location_id),
        parent_product_id: `${productParams.parent_product_id}`,
        id: r.created_object_id
      }))
    );
  }

  createLocation(name: string, description: string, isFreezer: boolean): Observable<GrocyLocation> {
    return this.http.post<GrocyItemCreated>(
      `${this.apiHost}/objects/locations`,
      {
        name,
        description,
        is_freezer: isFreezer ? "1" : "0"
      },
      { headers: {"GROCY-API-KEY": this.apiKey} }
    ).pipe(
      map(r => ({
        id: r.created_object_id,
        name,
        description,
        is_freezer: isFreezer ? "1" : "0"
      }))
    );
  }

  undoBooking(transactionId: string) {
    return this.http.post<void>(
      `${this.apiHost}/stock/bookings/${transactionId}/undo`,
      {},
      { headers: {"GROCY-API-KEY": this.apiKey} }
    );
  }

  undoTransaction(transactionId: string) {
    return this.http.post<void>(
      `${this.apiHost}/stock/transactions/${transactionId}/undo`,
      {},
      { headers: {"GROCY-API-KEY": this.apiKey} }
    );
  }

  openProduct(openParams: OpenProductsParams) {
    return this.http.post<{id: string; stock_id: string}>(
      `${this.apiHost}/stock/products/${openParams.productId}/open`,
      {amount: openParams.quantity},
      { headers: {"GROCY-API-KEY": this.apiKey} }
    );
  }

  consumeProduct(consumeParams: ConsumeProductsParams) {
    return this.http.post<{id: string; stock_id: string}>(
      `${this.apiHost}/stock/products/${consumeParams.productId}/consume`,
      {
        amount: consumeParams.quantity,
        transaction_type: "consume",
        spoiled: consumeParams.spoiled,
        location_id: consumeParams.locationId
      },
      { headers: {"GROCY-API-KEY": this.apiKey} }
    );
  }

  inventoryProduct(productId: string | number , inventoryParams: InventoryProductsParams) {
    return this.http.post<{id: string; stock_id: string}>(
      `${this.apiHost}/stock/products/${productId}/inventory`,
      inventoryParams,
      { headers: {"GROCY-API-KEY": this.apiKey} }
    );
  }

  purchaseProduct(purchaseProduct: PurchaseProductsParams) {
    return this.http.post<{id: string; stock_id: string}>(
      `${this.apiHost}/stock/products/${purchaseProduct.productId}/add`,
      {
        amount: purchaseProduct.quantity,
        best_before_date: purchaseProduct.bestBeforeDate,
        transaction_type: "purchase",
        location_id: purchaseProduct.locationId
      },
      { headers: {"GROCY-API-KEY": this.apiKey} }
    );
  }

  inStockItems(): Observable<GrocyStockEntry[]> {
    return this.http.get<GrocyStockAPIReturn[]>(
      `${this.apiHost}/stock`,
      { headers: {"GROCY-API-KEY": this.apiKey} }
    ).pipe(
      map(items => items.map(
        i => ({
          ...i,
          best_before_date: dateStringParser(i.best_before_date),
          is_in_stock: true,
          product: this.convertProductApiToLocal(i.product)
        })
      ))
    );
  }

  allStock(): Observable<GrocyStockEntry[]> {
    return forkJoin(
      this.inStockItems(),
      this.outOfStockStock()
    ).pipe(
      map(i => [...i[0], ...i[1]])
    );
  }

  outOfStockStock(): Observable<GrocyStockEntry[]> {
    return this.http.get<GrocyVolatileReturn>(
      `${this.apiHost}/stock/volatile?expiring_days=0`,
        { headers: {"GROCY-API-KEY": this.apiKey} }
    ).pipe(
      map(
        p => p.missing_products
          .filter(d => d.is_partly_in_stock === "0")
          .map(i => i.id)
      ),
      switchMap(
        missingProductId => this.allProducts().pipe(
          map(ps => ps.filter(p => missingProductId.indexOf(p.id) >= 0)),
          map(products => products.map(
            product => ({
              product_id: Number(product.id),
              amount: 0,
              amount_aggregated: 0,
              amount_opened: 0,
              amount_opened_aggregated: 0,
              best_before_date: new Date(),
              is_aggregated_amount: false,
              is_in_stock: false,
              product
            })
          ))
        )
      )
    );
  }

  private convertProductApiToLocal(data: GrocyProductAPIReturn): GrocyProduct {
    return {
      ...data,
      barcodes: data.barcode.split(","),
      quantity_unit_id_purchase: Number(data.qu_id_purchase),
      quantity_unit_id_stock: Number(data.qu_id_stock),
      quantity_unit_factor_purchase_to_stock: Number(data.qu_factor_purchase_to_stock),
      location_id: Number(data.location_id),
      min_stock_amount: Number(data.min_stock_amount),
      default_best_before_days: Number(data.default_best_before_days),
      default_best_before_days_after_open: Number(data.default_best_before_days_after_open),
      default_best_before_days_after_freezing: Number(data.default_best_before_days_after_freezing),
      default_best_before_days_after_thawing: Number(data.default_best_before_days_after_thawing)
    };
  }
}
