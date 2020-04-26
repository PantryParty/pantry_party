import { Component, ChangeDetectorRef, OnDestroy } from "@angular/core";

import { ScanResult } from "nativescript-barcodescanner";
import { ScannedItemManagerService } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { GrocyService, OpenProductsParams } from "~/app/services/grocy.service";
import { map, switchMap } from "rxjs/operators";

@Component({
  selector: "Open",
  templateUrl: "./open.component.html",
  providers: [ScannedItemManagerService]
})
export class OpenComponent implements OnDestroy {
  destroyed = false;

  constructor(
    private changeRef: ChangeDetectorRef,
    public scannedItemManager: ScannedItemManagerService,
    public grocyService: GrocyService
  ) {

    scannedItemManager.undoCallback = i => this.grocyService.undoBooking(i);

    scannedItemManager.saveCallback = i => {
      const openProductProps: OpenProductsParams = {
        productId: i.grocyProduct.id,
        quantity: i.quantity
      };

      return this.grocyService.addBarcodeToProduct(
        i.grocyProduct.id,
        i.barcode
      ).pipe(
        switchMap(
          () => this.grocyService.openProduct(openProductProps)
        ),
        map(r => r.id)
      );
    };
  }

  scanResults(evt: ScanResult) {
    this.scannedItemManager.newScanResults(evt);
    this.updateView();
  }

  ngOnDestroy() { this.destroyed = true; }
  updateView() {
    if (!this.destroyed) {
      this.changeRef.detectChanges();
    }
  }
}
