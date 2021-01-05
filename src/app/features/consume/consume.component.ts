import { Component, ChangeDetectorRef } from "@angular/core";

import { ScanResult } from "nativescript-barcodescanner";
import { ScannedItemManagerService } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { GrocyService, ConsumeProductsParams } from "~/app/services/grocy.service";
import { map, switchMap } from "rxjs/operators";
import {ScannedItemExernalLookupService} from "~/app/services/scanned-item-exernal-lookup.service";

export const factory = (g: GrocyService, si: ScannedItemExernalLookupService) => new ScannedItemManagerService(g, si)

@Component({
  selector: "Consume",
  templateUrl: "./consume.component.html",
  providers: [{
    provide: ScannedItemManagerService,
    deps: [GrocyService, ScannedItemExernalLookupService],
    useFactory: factory
  }]
})
export class ConsumeComponent {
  constructor(
    private changeRef: ChangeDetectorRef,
    public scannedItemManager: ScannedItemManagerService,
    public grocyService: GrocyService
  ) {

    scannedItemManager.undoCallback = i => this.grocyService.undoBooking(i);

    scannedItemManager.saveCallback = i => {
      const consumeProductProps: ConsumeProductsParams = {
        productId: i.grocyProduct.id,
        quantity: i.quantity,
        spoiled: false,
        locationId: i.location ? i.location.id : undefined
      };

      return this.grocyService.addBarcodeToProduct(
        i.grocyProduct.id,
        i.barcode
      ).pipe(
        switchMap(
          () => this.grocyService.consumeProduct(consumeProductProps)
        ),
        map(r => r.id)
      );
    };
  }

  scanResults(evt: ScanResult) {
    this.scannedItemManager.newScanResults(evt);
    this.updateView();
  }

  updateView() {
    this.changeRef.markForCheck();
  }
}
