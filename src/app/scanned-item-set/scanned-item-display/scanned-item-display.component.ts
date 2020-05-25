import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from "@angular/core";
import { ScannedItem } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { SwipeGestureEventData } from "@nativescript/core/ui/gestures/gestures";

@Component({
  selector: "ns-scanned-item-display",
  templateUrl: "./scanned-item-display.component.html",
  styleUrls: ["./scanned-item-display.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScannedItemDisplayComponent {
  @Input() scannedItem?: ScannedItem;
  @Input() savePaused = false;
  @Input() working = false;
  @Input() respectsPurchaseFactor = false;
  @Output() pausedToggled = new EventEmitter<boolean>();
  @Output() swipe = new EventEmitter<SwipeGestureEventData>();

  get status() {
    if (!this.scannedItem) {
      return "no_scanned_item";
    } else if (this.working) {
     return "working";
    } else if (!this.scannedItem.grocyProduct) {
      return "needs_product";
    } else if (this.scannedItem.currentVersion === this.scannedItem.lastSavedVersion) {
       return "saved";
    } else if (this.savePaused) {
      return "save_paused";
    } else {
      return "pending_save";
    }
  }

  get entryName() {
    if (this.scannedItem.grocyProduct) {
      return this.scannedItem.grocyProduct.name;
    } else if (this.scannedItem.externalProduct) {
      return this.scannedItem.externalProduct.name;
    } else {
      return `Unknown (${this.scannedItem.barcode})`;
    }
  }

  get purchaseFactorText() {
    if (this.scannedItem && this.scannedItem.grocyProduct) {
      return `x${this.scannedItem.grocyProduct.quantity_unit_factor_purchase_to_stock}`;
    }

    return "";
  }

  get displayPurchaseFactor() {
    return this.respectsPurchaseFactor
      && this.scannedItem
      && this.scannedItem.grocyProduct
      && this.scannedItem.grocyProduct.quantity_unit_factor_purchase_to_stock > 1
      ;
  }
}
