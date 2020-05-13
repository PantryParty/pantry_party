import { Component, ChangeDetectorRef, OnDestroy } from "@angular/core";

import { ScanResult } from "nativescript-barcodescanner";
import { ScannedItemManagerService } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { GrocyService, PurchaseProductsParams } from "~/app/services/grocy.service";
import { map, switchMap } from "rxjs/operators";

@Component({
  selector: "Purchase",
  templateUrl: "./purchase.component.html",
  providers: [ScannedItemManagerService]
})
export class PurchaseComponent implements OnDestroy {
  destroyed = false;
  constructor(
    private changeRef: ChangeDetectorRef,
    public scannedItemManager: ScannedItemManagerService,
    public grocyService: GrocyService
  ) {
    setTimeout(() => this.scanResults({text: "aaa", format: "UPC_A"}), 1000);

    scannedItemManager.respectsPurcahseFactor = true;
    scannedItemManager.undoCallback = i => this.grocyService.undoBooking(i);

    scannedItemManager.saveCallback = i => {
      const purchaseProductProps: PurchaseProductsParams = {
        productId: i.grocyProduct.id,
        quantity: i.quantity * i.grocyProduct.quantity_unit_factor_purchase_to_stock,
        bestBeforeDate: i.bestBeforeDate
      };

      return this.grocyService.addBarcodeToProduct(
        i.grocyProduct.id,
        i.barcode
      ).pipe(
        switchMap(
          () => this.grocyService.purchaseProduct(purchaseProductProps)
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
