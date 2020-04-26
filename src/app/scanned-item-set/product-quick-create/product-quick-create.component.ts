import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { ScannedItemManagerService, ScannedItem } from "../services/scanned-item-manager.service";

@Component({
  selector: "ns-product-quick-create",
  templateUrl: "./product-quick-create.component.html",
  styleUrls: ["./product-quick-create.component.css"]
})
export class ProductQuickCreateComponent {

  scannedItemManager: ScannedItemManagerService;
  scannedItems: ScannedItem[];

  constructor(
    private routerExtension: RouterExtensions,
    private stateTransfer: StateTransferService
  ) {
    const val = this.stateTransfer.readAndClearState();

    if (val && val.type === "productQuickCreate") {
      this.scannedItemManager = val.scannedItemManager;
      this.scannedItems = val.scannedItems;
    }
  }

}
