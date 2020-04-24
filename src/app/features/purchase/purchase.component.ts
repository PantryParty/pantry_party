import { Component, ChangeDetectorRef } from "@angular/core";

import { ScanResult } from "nativescript-barcodescanner";
import { ScannedItemManagerService } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { GrocyService, PurchaseProductsParams } from "~/app/services/grocy.service";
import { map, switchMap } from "rxjs/operators";

@Component({
  selector: "Purchase",
  templateUrl: "./purchase.component.html",
  providers: [ScannedItemManagerService]
})
export class PurchaseComponent {
  constructor(
    private changeRef: ChangeDetectorRef,
    public scannedItemManager: ScannedItemManagerService,
    public grocyService: GrocyService
  ) {
    setTimeout(() => this.scanResults({text: "014100085508", format: "UPC_A"}), 1000);
    setTimeout(() => this.scanResults({text: "041498254971", format: "UPC_A"}), 2000);
    setTimeout(() => this.scanResults({text: "658010118873", format: "UPC_A"}), 3000);
    setTimeout(() => this.scanResults({text: "20621483", format: "UPC_A"}), 4000);
    setTimeout(() => this.scanResults({text: "rjoqwjroi", format: "UPC_A"}), 4000);
    scannedItemManager.undoCallback = i => this.grocyService.undoBooking(i);

    scannedItemManager.saveCallback = i => {
      const purchaseProductProps: PurchaseProductsParams = {
        productId: i.grocyProduct.id,
        quantity: i.quantity,
        bestBeforeDate: "2020-12-30"
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
    this.changeRef.detectChanges();
  }

  updateView() {
    this.changeRef.detectChanges();
  }
}
