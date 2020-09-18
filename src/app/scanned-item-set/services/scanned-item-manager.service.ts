import { ScanResult } from "nativescript-barcodescanner";
import { BehaviorSubject, interval, ReplaySubject, Observable, concat, empty, of, Subject, EMPTY } from "rxjs";
import { GrocyProduct, GrocyLocation } from "~/app/services/grocy.interfaces";
import { GrocyService } from "~/app/services/grocy.service";
import { ExternalProduct, ScannedItemExernalLookupService } from "~/app/services/scanned-item-exernal-lookup.service";
import { map, takeUntil, finalize, take } from "rxjs/operators";
import { OnDestroy, Input } from "@angular/core";
import { ScannedAnnouncerService, FinalScanResults } from "~/app/services/scan-announcer";
import { toDateString, relativeDate } from "~/app/utilities/dateString";

interface BaseScannedItem {
  barcode: string;
  quantity: number;
  externalProduct?: ExternalProduct;
  currentVersion: string;
  lastSavedVersion: string;
  saveCoutdown: number;
  autoSave: boolean;
  saveInProgress: boolean;
  location?: GrocyLocation;
  bestBeforeDate: string;
}
export interface ScannedItem extends BaseScannedItem {
  grocyProduct?: GrocyProduct;
}

interface ReadyScannedItem extends BaseScannedItem {
  grocyProduct: GrocyProduct;
}

export class ScannedItemManagerService implements OnDestroy {

  get allPendingScannedItems() {
    return this.scannedItems.filter(i => !i.grocyProduct && !this.isWorking(i.barcode));
  }

  get workingBarcodes(): Record<string, boolean> {
    const working: Record<string, boolean> = {};

    this._scannedItems.forEach(i => {
      working[i.barcode] = this.isWorking(i.barcode) || i.saveInProgress;
    });

    return working;
  }

  private get scannedItems() { return this._scannedItems; }
  private set scannedItems(v: ScannedItem[]) {
    this._scannedItems = v;
    this.updatedScannedItems.next(v);
  }
  defaultLocation?: GrocyLocation;

  scanResults = new Subject<FinalScanResults>();
  annouceScannedItems = true;
  scanAnnouncer = new ScannedAnnouncerService(this.scanResults);
  respectsPurchaseFactor = false;

  defaultWaitToSave = 20;
  createDelay = 5;

  pausedItemBarcodes: Record<string, boolean> = {};

  updatedScannedItems = new BehaviorSubject<ScannedItem[]>([]);

  private pvtWorkingItemBarcodes: Record<string, number | undefined> = {};
  private pvtUndoKey: Record<string, string> = {};
  private ngUnsubscribe = new ReplaySubject<true>();

  private timerTick = interval(1000).pipe(
    takeUntil(this.ngUnsubscribe),
    map(_ => this._scannedItems.forEach(i => {
      if (this.elgibleForSave(i) && i.saveCoutdown > 1) {
        this.updateScannedItemWithoutVersionBump(
          i.barcode,
          {saveCoutdown: i.saveCoutdown - 1}
        );
      } else if (!i.saveInProgress && this.elgibleForSave(i) && i.saveCoutdown <= 1) {
        this.perfomSave(i);
      }
    }))
  ).subscribe();

  private _scannedItems: ScannedItem[] = [];

  constructor(
    private grocyService: GrocyService,
    private externalLookupService: ScannedItemExernalLookupService
  ) {
  }
  determineBestBeforeDate = (item: ScannedItem): string | null => {
    const product = item.grocyProduct;
    if (!product) {
      return toDateString(new Date());
    }

    let defaultBestBefore = product.default_best_before_days;

    if (item.location && item.location.is_freezer === "1") {
      defaultBestBefore = product.default_best_before_days_after_freezing;
    }

    if (defaultBestBefore === -1) {
      defaultBestBefore = 36500;
    }

    return toDateString(relativeDate(defaultBestBefore));
  }

  undoCallback: (s: string) => Observable<any> = _ => of("");
  saveCallback: (s: ReadyScannedItem) => Observable<string> = _ => of("");

  perfomSave(item: ReadyScannedItem) {
    this.updateScannedItemWithoutVersionBump(
      item.barcode,
      {saveInProgress: true}
    );
    const lastUndoKey = this.pvtUndoKey[item.barcode];
    const undo$ = lastUndoKey ? this.undoCallback(lastUndoKey) : EMPTY;

    concat(
      undo$.pipe(
        map(() => delete this.pvtUndoKey[item.barcode])
      ),
      this.saveCallback(item).pipe(
        map(r => {
          this.pvtUndoKey[item.barcode] = r;

          this.updateScannedItemWithoutVersionBump(
            item.barcode,
            { lastSavedVersion: item.currentVersion }
          );
        })
      )
    ).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.updateScannedItemWithoutVersionBump(
        item.barcode,
        {saveInProgress: false}
      )),
      take(1)
    ).subscribe();
  }

  newScanResults(r: ScanResult) {
    if (this.indexOfBarcode(r.text) > -1) {
      this.changeQuantityBy(r.text, 1);
    } else {
      const newItem: ScannedItem = {
        barcode: r.text,
        quantity: 1,
        currentVersion: this.generateVersion(),
        lastSavedVersion: "",
        autoSave: true,
        saveInProgress: false,
        saveCoutdown: this.defaultWaitToSave,
        bestBeforeDate: toDateString(new Date()),
        location: this.defaultLocation
      };

      this.findGrocyProduct(newItem);

      this.scannedItems = [newItem].concat(this.scannedItems);
    }
  }

  changeQuantityBy(barcode: string, quantity: number) {
    const originalItem = this.scannedItems[this.indexOfBarcode(barcode)];
    const newItem = {
      ...originalItem,
      quantity: originalItem.quantity + quantity,
      currentVersion: this.generateVersion(),
      saveCoutdown: this.defaultWaitToSave
    };

    this.scannedItems = [newItem].concat(
      this.scannedItems.slice(0, this.indexOfBarcode(barcode)),
      this.scannedItems.slice(this.indexOfBarcode(barcode) + 1)
    );
  }

  updateItem(newItem: ScannedItem) {
    const loc = this.indexOfBarcode(newItem.barcode);

    this.scannedItems = this.scannedItems.slice(0, loc).concat(
      [newItem],
      this.scannedItems.slice(loc + 1)
    );
  }

  removeScannedItemByBarcode(barcode: string) {
    const loc = this.indexOfBarcode(barcode);

    if (loc < 0) {
      return;
    }

    this.scannedItems = this.scannedItems.slice(0, loc).concat(
      this.scannedItems.slice(loc + 1)
    );
  }

  updateScannedItem(
    barcode: string,
    partialItem: Partial<ScannedItem>
  ) {
    this.updateScannedItemWithoutVersionBump(
      barcode,
      {
        currentVersion: this.generateVersion(),
        saveCoutdown: this.defaultWaitToSave,
        ...partialItem
      }
    );

    if (partialItem.location && !partialItem.bestBeforeDate) {
      this.refreshBestBeforeDate(barcode);
    }
  }

  ngOnDestroy() {
    this.scanAnnouncer.ngOnDestroy();
    this.ngUnsubscribe.next(true);
  }

  togglePause(scannedItems: ScannedItem) {
    this.pausedItemBarcodes = {
      ...this.pausedItemBarcodes,
      [scannedItems.barcode]: !this.pausedItemBarcodes[scannedItems.barcode]
    };
  }

  assignProductToBarcode(barcode: string, product: GrocyProduct, location?: GrocyLocation) {
    const update: Partial<ScannedItem> = { grocyProduct: product, location };

    this.updateScannedItem(barcode, update);

    const currentItem = this.itemByBarcode(barcode);
    if (!currentItem.location) {
      this.fetchDefaultLocationForItem(this.itemByBarcode(barcode));
    }
  }

  private refreshBestBeforeDate(barcode: string) {
    const currentItem = this.itemByBarcode(barcode);
    const newDate = this.determineBestBeforeDate(currentItem);
    if (newDate) {
      this.updateScannedItem(barcode, { bestBeforeDate: newDate });
    }
  }

  private updateScannedItemWithoutVersionBump(
    barcode: string,
    partialItem: Partial<ScannedItem>
  ) {
    this.updateItem({
      ...this.scannedItems[this.indexOfBarcode(barcode)],
      ...partialItem
    });
  }

  private fetchDefaultLocationForItem(item: ScannedItem) {
    this.setWorking(item.barcode, true);

    this.grocyService.getLocation(item.grocyProduct.location_id).pipe(
      finalize(() => this.setWorking(item.barcode, false))
    ).subscribe(location => this.updateScannedItem(item.barcode, { location }));
  }

  private findGrocyProduct(item: ScannedItem) {
    this.setWorking(item.barcode, true);

    this.grocyService
    .searchForBarcode(item.barcode)
    .pipe(
      finalize(() => this.setWorking(item.barcode, false))
    ).subscribe(r => {
      console.log("sending success");
      this.scanResults.next({status: "success", itemName: r.name});
      this.assignProductToBarcode(item.barcode, r);
    }, e => {
      if (e.status === 400) {
        this.searchForItemExternally(item);
      } else {
        console.log("received error fetching grocy product", e);
        console.log("sending failure");
        this.scanResults.next({status: "failure"});
      }
    }
               );
  }

  private foundExternalItem(item: ScannedItem, external: ExternalProduct) {
    console.log("sending success");
    this.scanResults.next({ status: "success", itemName: external.name });
    this.updateScannedItem(item.barcode, { externalProduct: external });
  }

  private searchForItemExternally(item: ScannedItem) {
    this.setWorking(item.barcode, true);
    this.externalLookupService.search(item.barcode)
    .pipe(
      finalize(() => this.setWorking(item.barcode, false))
    ).subscribe(
      r => this.foundExternalItem(item, r),
      _ => this.scanResults.next({status: "failure"})
    );
  }

  private itemByBarcode(barcode: string) {
    return this.scannedItems[this.indexOfBarcode(barcode)];
  }

  private indexOfBarcode(barcode: string) {
    return this.scannedItems.findIndex(e => e.barcode === barcode);
  }

  private generateVersion() {
    return Math.random().toString(36).substring(2);
  }

  private elgibleForSave(item: ScannedItem): item is ReadyScannedItem {
    return !!item.grocyProduct &&
      item.currentVersion !== item.lastSavedVersion;
  }

  private isWorking(barcode: string): boolean {
    return !!this.pvtWorkingItemBarcodes[barcode];
  }

  private setWorking(barcode: string, working: boolean) {
    if (!this.pvtWorkingItemBarcodes[barcode]) {
      this.pvtWorkingItemBarcodes[barcode] = 0;
    }

    if (working) {
      this.pvtWorkingItemBarcodes[barcode] += 1;
    } else if (this.pvtWorkingItemBarcodes[barcode] > 0) {
      this.pvtWorkingItemBarcodes[barcode] -= 1;
    }
  }
}
