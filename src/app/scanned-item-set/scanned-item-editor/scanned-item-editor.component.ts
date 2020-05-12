import { Component, NgZone, ChangeDetectorRef, ViewChild } from "@angular/core";
import { ScannedItem } from "../services/scanned-item-manager.service";
import { android as androidApplication  } from "tns-core-modules/application";
import { NamedThingSelectorButton } from "../named-thing-selector-button";
import { GrocyLocation, GrocyProduct } from "~/app/services/grocy.interfaces";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { RouterExtensions } from "nativescript-angular";
import { GrocyService } from "~/app/services/grocy.service";
import { dateString } from "~/app/utilities/dateString";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular/dataform-directives";
import { FormBuilder, Validators } from "@angular/forms";

export type ScannedItemUpdateOutput = Pick<
  ScannedItem,
  "quantity" | "location" | "bestBeforeDate" | "grocyProduct"
>;

interface EditorCallbackRemove {
  action: "remove";
  barcode: string;
}

interface EditorCallbackUpdate {
  action: "update";
  scannedItem: ScannedItemUpdateOutput;
}

export type ScannedItemEditorCallback = (x: EditorCallbackRemove | EditorCallbackUpdate) => any;

@Component({
  selector: "ns-scanned-item-editor",
  templateUrl: "./scanned-item-editor.component.html"
})
export class ScannedItemEditorComponent {
  scannedItem: Pick< ScannedItem, "quantity" | "location" | "bestBeforeDate" | "grocyProduct" >;
  originalScannedItem: ScannedItem;
  @ViewChild("configForm", { static: false }) configForm: RadDataFormComponent;
  locationsArr: GrocyLocation[] = [];
  productsArr: GrocyProduct[] = [];

  selectionCallback: null | ScannedItemEditorCallback  = null;

  form = this._fb.group ({
    quantity: [0, [Validators.required, Validators.min(0)]],
    location: [null, Validators.required],
    product: [null, Validators.required]
  });

  constructor(
    private stateTransfer: StateTransferService,
    private ngZone: NgZone,
    private routedExtensions: RouterExtensions,
    private grocyService: GrocyService,
    private changeRef: ChangeDetectorRef,
    private _fb: FormBuilder
  ) {
    this.grocyService.locations().subscribe(loc => this.locationsArr = loc);
    this.grocyService.allProducts().subscribe(prods => this.productsArr = prods);

    const state = this.stateTransfer.readAndClearState();

    if (state && state.type === "scannedItemEdit") {
      this.originalScannedItem = state.scannedItem;

      this.scannedItem = {
        quantity: this.originalScannedItem.quantity,
        location: this.originalScannedItem.location || null,
        bestBeforeDate: this.originalScannedItem.bestBeforeDate,
        grocyProduct: this.originalScannedItem.grocyProduct || null
      };

      this.selectionCallback = state.callback;
    }

  }

  productUpdated() {
    const product = this.form.get("product").value;
    const locationControl = this.form.get("location");

    if (product && product.location_id && (!locationControl.value || locationControl.untouched)) {
      this.grocyService.getLocation(product.location_id).subscribe(location => {
        this.form.get("location").setValue(location);
      });
    }
  }

  formControl(name: string) {
    return this.form.get(name);
  }

  save() {
   // const data: ScannedItemUpdateOutput = {
   //   ...this.scannedItem,
   //   location: this.locationSelector.value as GrocyLocation,
   //   grocyProduct: this.productSelector.value as GrocyProduct
   // };

   // if (this.selectionCallback) {
   //   this.selectionCallback({
   //     action: "update",
   //     scannedItem: data
   //   });
   //   this.routedExtensions.back();
   // }
  }

  remove() {
    if (this.selectionCallback) {
      this.selectionCallback({
        action: "remove",
        barcode: this.originalScannedItem.barcode
      });
      this.routedExtensions.back();
    }
  }

  createNewLocation() {
    this.stateTransfer.setState({
      type: "locationCreation",
      callback: location => {
        this.locationsArr = [location].concat(this.locationsArr);
        this.formControl("location").setValue(location);
      }
    });
    this.routedExtensions.navigate(["/locations/create"]);
  }

  createNewProduct() {
    this.stateTransfer.setState({
      type: "productCreation",
      callback: product => {
        this.productsArr = [product].concat(this.productsArr);
        this.formControl("product").setValue(location);
        this.productUpdated();
      }
    });
    this.routedExtensions.navigate(["/products/create"]);
  }
}
