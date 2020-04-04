import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogParams, ModalDialogService, ModalDialogOptions } from "nativescript-angular";
import { ScannedItem } from "../services/scanned-item-manager.service";
import { ios, android as androidApplication  } from "tns-core-modules/application";
import { LocationSelectorComponent } from "~/app/location-selection/location-selector.component";
import { NamedThingSelectorButton } from "../named-thing-selector-button";
import { ProductSelectorComponent } from "~/app/product-selection/product-selector.component";
import { GrocyLocation, GrocyProduct } from "~/app/services/grocy.interfaces";

export type ScannedItemEditorOutput = ScannedItemUpdateOutput | RemoveScannedItemOutput;

export interface ScannedItemUpdateOutput
extends Pick< ScannedItem, "quantity" | "location" | "bestBeforeDate" | "grocyProduct" > {
  action: "update";
}

export interface RemoveScannedItemOutput {
  action: "remove";
  barcode: string;
}

@Component({
  selector: "ns-scanned-item-editor",
  templateUrl: "./scanned-item-editor.component.html"
})
export class ScannedItemEditorComponent {
  scannedItem: Pick< ScannedItem, "quantity" | "location" | "bestBeforeDate" | "grocyProduct" >;
  originalScannedItem: ScannedItem;
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

  productSelector = new NamedThingSelectorButton<GrocyProduct>(
    "Product",
    () => {
      const options: ModalDialogOptions = {
        viewContainerRef: this._vcRef,
        context: {
          scannedItem: this.originalScannedItem
        },
        fullscreen: true,
        animated: true
      };

      return this._modalService.showModal(ProductSelectorComponent, options);
    }
  );

  constructor(
    private params: ModalDialogParams,
    private _modalService: ModalDialogService,
    private _vcRef: ViewContainerRef
  ) {
    this.originalScannedItem = params.context;

    this.scannedItem = {
      quantity: this.originalScannedItem.quantity,
      location: this.originalScannedItem.location || null,
      bestBeforeDate: this.originalScannedItem.bestBeforeDate,
      grocyProduct: this.originalScannedItem.grocyProduct || null
    };
  }

  onEditorUpdate(args: any) {
    if (args.propertyName === "bestBeforeDate") {
      this.changeDateFormatting(args.editor);
    }
  }

  goBack() {
    this.params.closeCallback();
  }

  save() {
    const data: ScannedItemUpdateOutput = {
      ...this.scannedItem,
      action: "update",
      location: this.locationSelector.value as GrocyLocation,
      grocyProduct: this.productSelector.value as GrocyProduct
    };
    this.params.closeCallback(data);
  }

  remove() {
    const data: RemoveScannedItemOutput = {
      action: "remove",
      barcode: this.originalScannedItem.barcode
    };

    this.params.closeCallback(data);
  }

  // Location Updater
  private changeDateFormatting(editor: any) {
    // if (ios) {
    //   const dateFormatter = NSDateFormatter.alloc().init();
    //   dateFormatter.dateFormat = "yyyy-MM-dd";
    //   editor.dateFormatter = dateFormatter;
    // } else {
    if (androidApplication) {
      const simpleDateFormat = new java.text.SimpleDateFormat("MMMM dd, yyyy", java.util.Locale.US);
      editor.setDateFormat(simpleDateFormat);
    }
  }
}
