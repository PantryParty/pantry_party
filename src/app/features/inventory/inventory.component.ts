import { Component, ChangeDetectorRef, OnDestroy } from "@angular/core";

import { ScanResult } from "nativescript-barcodescanner";
import { ScannedItemManagerService } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { GrocyService, InventoryProductsParams } from "~/app/services/grocy.service";
import { map, switchMap } from "rxjs/operators";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { RouterExtensions } from "nativescript-angular";
import { GrocyLocation } from "~/app/services/grocy.interfaces";

@Component({
  selector: "Inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
  providers: [ScannedItemManagerService]
})
export class InventoryComponent implements OnDestroy {
  inventoryLocation?: GrocyLocation;

  destroyed = false;

  constructor(
    private changeRef: ChangeDetectorRef,
    public scannedItemManager: ScannedItemManagerService,
    public grocyService: GrocyService,
    private stateTransfer: StateTransferService,
    private routerExtensions: RouterExtensions
  ) {
    setTimeout(() => this.scanResults({text: "014100085508", format: "UPC_A"}), 1000);
    // setTimeout(() => this.scanResults({text: "041498254971", format: "UPC_A"}), 2000);
    // setTimeout(() => this.scanResults({text: "658010118873", format: "UPC_A"}), 3000);
    // setTimeout(() => this.scanResults({text: "20621483", format: "UPC_A"}), 4000);
    // setTimeout(() => this.scanResults({text: "rjoqwjroi", format: "UPC_A"}), 4000);
    scannedItemManager.undoCallback = i => this.grocyService.undoBooking(i);

    scannedItemManager.saveCallback = i => {
      const inventoryProductProps: InventoryProductsParams = {
        new_amount: i.quantity,
        best_before_date: i.bestBeforeDate,
        location_id: i.location ? i.location.id : 0
      };

      return this.grocyService.addBarcodeToProduct(
        i.grocyProduct.id,
        i.barcode
      ).pipe(
        switchMap(
          () => this.grocyService.inventoryProduct(
            i.grocyProduct.id,
            inventoryProductProps
          )
        ),
        map(r => r.id)
      );
    };
  }

  selectNewLocation() {
    this.stateTransfer.setState({
      type: "locationSelection",
      callback: r => this.inventoryLocation = r.location
    });
    this.routerExtensions.navigate(["/locations"]);
  }

  scanResults(evt: ScanResult) {
    this.scannedItemManager.newScanResults(evt);
    this.updateView();
  }

  locationNoticeText() {
    if (this.inventoryLocation) {
      return `Inventorying ${this.inventoryLocation.name} (tap to change)`;
    } else {
      return `Tap to select a location and start`;
    }
  }

  ngOnDestroy() { this.destroyed = true; }
  updateView() {
    if (!this.destroyed) {
      this.changeRef.detectChanges();
    }
  }
}
