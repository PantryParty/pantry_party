import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { ModalDialogParams, ModalDialogOptions, ModalDialogService } from "nativescript-angular";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular/dataform-directives";

import { GrocyService } from "~/app/services/grocy.service";
import { GrocyProduct, GrocyLocation } from "~/app/services/grocy.interfaces";
import { NamedThingSelectorButton } from "../scanned-item-set/named-thing-selector-button";
import { LocationSelectorComponent } from "../features/location-managment/location-modal/location-selector.component";

export type ProductSelectorDismiss  = GrocyProduct | null;

@Component({
  selector: "ns-product-creation",
  templateUrl: "./product-creation.component.html"
})
export class ProductCreationComponent implements OnInit {
  @ViewChild("productCreate", { static: false }) productForm: RadDataFormComponent;

  quantityUnits: Map<string, string> = new Map([]);

  locationSelector = new NamedThingSelectorButton<GrocyLocation>(
    "Location",
    () => {
      const options: ModalDialogOptions = {
        viewContainerRef: this._vcRef,
        context: {},
        fullscreen: true,
        animated: true
      };

      return this._modalService.showModal(LocationSelectorComponent, options);
    }
  );

  grocyProduct = {
    name: "",
    minStockAccmount: 0,
    bestBeforeDays: 0,
    bestBeforeDaysAfterOpen: 0,
    bestBeforeDaysAfterFreezing: 0,
    bestBeforeDaysAfterThawing: 0,
    quantityUnitPurchase: "",
    quantityUnitStock: "",
    purchaseFator: 1
  };

  constructor(
    private grocyService: GrocyService,
    private modalParams: ModalDialogParams,
    private _modalService: ModalDialogService,
    private _vcRef: ViewContainerRef
  ) {
    const scannedItem = this.modalParams.context.scannedItem;
    if (scannedItem && scannedItem.externalProduct) {
      this.grocyProduct.name = scannedItem.externalProduct.name;
    }
  }

  ngOnInit() {
    this.grocyService.quantityUnits().subscribe(u => {
      this.quantityUnits = new Map(u.map(i => [i.id, i.name]));
    });
  }

  goBack() {
    this.modalParams.closeCallback(null);
  }

  create() {
    this.productForm.dataForm.validateAll().then(r => {
      if (r) {
        this.grocyService.createProduct({
          name: this.grocyProduct.name,
          description: "",
          location_id: 1,
          quantity_unit_id_purchase: Number(this.grocyProduct.quantityUnitPurchase),
          quantity_unit_id_stock: Number(this.grocyProduct.quantityUnitStock),
          quantity_unit_factor_purchase_to_stock: this.grocyProduct.purchaseFator,
          barcodes: [],
          min_stock_amount: this.grocyProduct.minStockAccmount,
          default_best_before_days: this.grocyProduct.bestBeforeDays,
          default_best_before_days_after_open: this.grocyProduct.bestBeforeDaysAfterOpen,
          default_best_before_days_after_thawing: this.grocyProduct.bestBeforeDaysAfterThawing,
          default_best_before_days_after_freezing: this.grocyProduct.bestBeforeDaysAfterFreezing
        }).subscribe(newProduct => this.modalParams.closeCallback(newProduct));
      }
    });
  }
}
