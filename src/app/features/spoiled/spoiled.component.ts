import { Component, ChangeDetectorRef, OnDestroy } from "@angular/core";

import { ScanResult } from "nativescript-barcodescanner";
import { ScannedItemManagerService } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { GrocyService, ConsumeProductsParams } from "~/app/services/grocy.service";
import { map, switchMap } from "rxjs/operators";
import {ScannedItemExernalLookupService} from "~/app/services/scanned-item-exernal-lookup.service";

export const factory = (g: GrocyService, si: ScannedItemExernalLookupService) => new ScannedItemManagerService(g, si)

@Component({
  selector: "Spoiled",
  templateUrl: "./spoiled.component.html",
  providers: [{
    provide: ScannedItemManagerService,
    deps: [GrocyService, ScannedItemExernalLookupService],
    useFactory: factory
  }]
})
export class SpoiledComponent implements OnDestroy {
  destroyed = false;
  constructor(
    private changeRef: ChangeDetectorRef,
    public scannedItemManager: ScannedItemManagerService,
    public grocyService: GrocyService
  ) {

    scannedItemManager.undoCallback = i => this.grocyService.undoBooking(i);

    scannedItemManager.saveCallback = i => {
      const spoiledProductProps: ConsumeProductsParams = {
        productId: i.grocyProduct.id,
        quantity: i.quantity,
        spoiled: true
      };

      return this.grocyService.addBarcodeToProduct(
        i.grocyProduct.id,
        i.barcode
      ).pipe(
        switchMap(
          () => this.grocyService.consumeProduct(spoiledProductProps)
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
