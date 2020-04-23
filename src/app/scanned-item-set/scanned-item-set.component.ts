import { Component, Input, ViewContainerRef } from "@angular/core";
import { ScannedItemManagerService, ScannedItem } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { ModalDialogOptions, ModalDialogService } from "nativescript-angular";
import { ScannedItemEditorEntryComponent } from "./scanned-item-editor/scanned-item-editor-entry.component";
import { ScannedItemEditorOutput } from "./scanned-item-editor/scanned-item-editor.component";
import { SwipeOnItemData } from "./scanned-item-list/scanned-item-list.component";
import { SwipeDirection } from "@nativescript/core/ui/gestures/gestures";

@Component({
  selector: "ns-scanned-item-set",
  templateUrl: "./scanned-item-set.component.html",
  styleUrls: ["./scanned-item-set.component.css"]
})
export class ScannedItemSetComponent {
  @Input() scannedItemManager: ScannedItemManagerService;

  constructor(
  ) {}

  itemTapped(item: ScannedItem) {
    // this._modalService.showModal(ScannedItemEditorEntryComponent, options)
    // .then((result?: ScannedItemEditorOutput) => {
    //   switch (result.action) {
    //     case "update":
    //       return this.scannedItemManager.updateScannedItem(
    //         item.barcode,
    //         result
    //     );
    //     case "remove":
    //       return this.scannedItemManager.removeScannedItemByBarcode(item.barcode);
    //   }
    // });
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
