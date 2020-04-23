import { Component, Input, ViewContainerRef } from "@angular/core";
import { ScannedItemManagerService, ScannedItem } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from "nativescript-angular";
import { ScannedItemEditorEntryComponent } from "./scanned-item-editor/scanned-item-editor-entry.component";
import { SwipeOnItemData } from "./scanned-item-list/scanned-item-list.component";
import { SwipeDirection } from "@nativescript/core/ui/gestures/gestures";
import { ActivatedRoute } from "@angular/router";
import { StateTransferService } from "../services/state-transfer.service";

@Component({
  selector: "ns-scanned-item-set",
  templateUrl: "./scanned-item-set.component.html",
  styleUrls: ["./scanned-item-set.component.css"]
})
export class ScannedItemSetComponent {
  @Input() scannedItemManager: ScannedItemManagerService;

  constructor(
    private routerExtension: RouterExtensions,
    private route: ActivatedRoute,
    private stateTransfer: StateTransferService
  ) {}

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
}
