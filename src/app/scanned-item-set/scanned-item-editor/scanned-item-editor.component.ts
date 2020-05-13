import { Component, NgZone, ChangeDetectorRef, ViewChild } from "@angular/core";
import { ScannedItem } from "../services/scanned-item-manager.service";
import { android as androidApplication  } from "tns-core-modules/application";
import { GrocyLocation, GrocyProduct } from "~/app/services/grocy.interfaces";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { RouterExtensions } from "nativescript-angular";
import { GrocyService } from "~/app/services/grocy.service";
import { relativeDate, toDateString } from "~/app/utilities/dateString";
import { FormBuilder, Validators } from "@angular/forms";
import { dateStringParser } from "~/app/utilities/dateStringParser";

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
  locationsArr: GrocyLocation[] = [];
  productsArr: GrocyProduct[] = [];

  selectionCallback: null | ScannedItemEditorCallback  = null;

  form = this._fb.group ({
    quantity: [0, [Validators.required, Validators.min(0)]],
    location: [null, Validators.required],
    product: [null, Validators.required],
    bestByDate: [new Date(), Validators.required]
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

      this.form.setValue({
        quantity: this.originalScannedItem.quantity,
        location: this.originalScannedItem.location || null,
        product: this.originalScannedItem.grocyProduct || null,
        bestByDate: dateStringParser(this.originalScannedItem.bestBeforeDate)
      });

      this.selectionCallback = state.callback;
    }

  }

  productUpdated() {
    const product = this.form.get("product").value as GrocyProduct | null;
    if (!product) {
      return;
    }

    const locationControl = this.form.get("location");

    if (product.location_id && (!locationControl.value || locationControl.untouched)) {
      this.grocyService.getLocation(product.location_id).subscribe(location => {
        this.form.get("location").setValue(location);
        this.updateDate();
      });
    }

    this.updateDate();
  }

  updateDate() {
    const product = this.form.get("product").value as GrocyProduct | null;
    const location = this.form.get("location").value as GrocyLocation | null;
    if (
      product.default_best_before_days &&
      this.form.get("bestByDate").untouched
    ) {
      let bestBefore = product.default_best_before_days;

      if (location && location.is_freezer === "1") {
        bestBefore = product.default_best_before_days_after_freezing;
      }

      this.form.get("bestByDate").setValue(
        relativeDate(bestBefore === -1 ? 36500 : bestBefore)
      );
      this.form.get("bestByDate").markAsUntouched();
    }
  }

  formControl(name: string) {
    return this.form.get(name);
  }

  save() {
   const data: ScannedItemUpdateOutput = {
     quantity: this.form.get("quantity").value,
     location: this.form.get("location").value,
     grocyProduct: this.form.get("product").value,
     bestBeforeDate: toDateString(this.form.get("bestByDate").value)
   };

   if (this.selectionCallback) {
     this.selectionCallback({
       action: "update",
       scannedItem: data
     });
     this.routedExtensions.back();
   }
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
