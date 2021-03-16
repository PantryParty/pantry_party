import { Component, Input } from "@angular/core";
import { ScannedItemManagerService, ScannedItem } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import {  RouterExtensions } from "@nativescript/angular";
import { SwipeOnItemData } from "./scanned-item-list/scanned-item-list.component";
import { SwipeDirection } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { StateTransferService } from "../services/state-transfer.service";
import { slideInOutDownAnimation } from "../utilities/animations";

@Component({
  selector: "ns-scanned-item-set",
  templateUrl: "./scanned-item-set.component.html",
  styleUrls: ["./scanned-item-set.component.scss"],
  animations: [
    slideInOutDownAnimation
  ]
})
export class ScannedItemSetComponent {
  @Input() scannedItemManager: ScannedItemManagerService;

  constructor(
    private routerExtension: RouterExtensions,
    private route: ActivatedRoute,
    private stateTransfer: StateTransferService
  ) {}

  quickCreateProducts() {
    this.stateTransfer.setState({
      type: "productQuickCreate",
      scannedItems: this.scannedItemManager.allPendingScannedItems,
      scannedItemManager: this.scannedItemManager
    });

    this.routerExtension.navigate(
      ["../quickCreateProducts"],
      { relativeTo:  this.route }
    );
  }

  itemTapped(item: ScannedItem) {
    this.stateTransfer.setState({
      type: "scannedItemEdit",
      scannedItem: item,
      callback: result => {
        switch (result.action) {
          case "remove":
            return this.scannedItemManager.removeScannedItemByBarcode(item.barcode);
          case "update":
            return this.scannedItemManager.updateScannedItem(
              item.barcode,
              result.scannedItem
            );
        }
      }
    });

    this.routerExtension.navigate(
      ["../editScannedItem"],
      { relativeTo:  this.route }
    );
  }

  handlePausedItem(item: ScannedItem) {
    if (this.scannedItemManager) {
      this.scannedItemManager.togglePause(item);
    }
  }

  swipeOnItem({item, $event}: SwipeOnItemData) {
   if ($event.direction === SwipeDirection.left) {
     this.scannedItemManager.removeScannedItemByBarcode(item.barcode);
   }
  }

  showWarning() {
    console.log(this.scannedItemManager.allPendingScannedItems.length > 0)
    return this.scannedItemManager.allPendingScannedItems.length > 0;
  }
  pendingItemWarningText() {
    const total = this.scannedItemManager.allPendingScannedItems.length;

    return `Complete ${total} Product${total > 1 ? "s" : ""} now`;
  }
}
