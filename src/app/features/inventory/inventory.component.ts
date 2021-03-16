import { Component, ChangeDetectorRef, OnDestroy } from "@angular/core";

import { ScanResult } from "nativescript-barcodescanner";
import { ScannedItemManagerService, ScannedItemManagerServiceProvider } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { GrocyService, InventoryProductsParams } from "~/app/services/grocy.service";
import { map, switchMap } from "rxjs/operators";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { RouterExtensions } from "@nativescript/angular";
import { GrocyLocation } from "~/app/services/grocy.interfaces";
import {ScannedItemExernalLookupService} from "~/app/services/scanned-item-exernal-lookup.service";


@Component({
  selector: "Inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
  providers: [ScannedItemManagerServiceProvider]
})
export class InventoryComponent implements OnDestroy {
  get inventoryLocation(): GrocyLocation {
    return this._inventoryLocation;
  }
  set inventoryLocation(value: GrocyLocation) {
    this.scannedItemManager.defaultLocation = value;
    this._inventoryLocation = value;
  }

  destroyed = false;
  private _inventoryLocation?: GrocyLocation;

  constructor(
    private changeRef: ChangeDetectorRef,
    public scannedItemManager: ScannedItemManagerService,
    public grocyService: GrocyService,
    private stateTransfer: StateTransferService,
    private routerExtensions: RouterExtensions
  ) {
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
