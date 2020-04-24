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

  locationSelector = new NamedThingSelectorButton<GrocyLocation>(
    "Location",
    () => new Promise<GrocyLocation>((resolve, _) => {
      this.ngZone.run(() => {
        this.stateTransfer.setState({
          type: "locationSelection",
          callback: r => resolve(r.location)
        });
        this.routedExtensions.navigate(["/locations"]);
      });
    })
  );

  productSelector = new NamedThingSelectorButton<GrocyProduct>(
    "Product",
    () => new Promise<GrocyProduct>((resolve, _) => {
      this.ngZone.run(() => {
        this.stateTransfer.setState({
          type: "productSelection",
          forScannedItem: this.originalScannedItem,
          callback: r => {
            this.productUpdated(r.product);
            resolve(r.product);
          }
        });
        this.routedExtensions.navigate(["/products"]);
      });
    })
  );

  selectionCallback: null | ScannedItemEditorCallback  = null;

  constructor(
    private stateTransfer: StateTransferService,
    private ngZone: NgZone,
    private routedExtensions: RouterExtensions,
    private grocyService: GrocyService,
    private changeRef: ChangeDetectorRef
  ) {
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

  productUpdated(prod: GrocyProduct) {
    if (prod.location_id) {
      this.grocyService.getLocation(prod.location_id).subscribe(location => {
        this.locationSelector.setValue(location);
      });
    }
  }

  onEditorUpdate(args: any) {
    if (args.propertyName === "bestBeforeDate") {
      this.changeDateFormatting(args.editor);
    }
  }

  save() {
    const data: ScannedItemUpdateOutput = {
      ...this.scannedItem,
      location: this.locationSelector.value as GrocyLocation,
      grocyProduct: this.productSelector.value as GrocyProduct
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
