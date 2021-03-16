import { Component } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { ScannedItemManagerService, ScannedItem } from "../services/scanned-item-manager.service";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyLocation, GrocyQuantityUnit, GrocyProduct } from "~/app/services/grocy.interfaces";
import { EventData } from "@nativescript/core";
import { ListPicker } from "@nativescript/core";
import { SwipeGestureEventData, SwipeDirection } from "@nativescript/core";
import { slideOutLeftAnimation } from "~/app/utilities/animations";
import { Observable, of } from "rxjs";
import { tap, catchError, mergeMap, switchMap, mapTo } from "rxjs/operators";
import { OpenFoodFactsService } from "~/app/services/openfoodfacts.service";
import { UPCItemDbService } from "~/app/services/upcitemdb.service";
import { UPCDatabaseService } from "~/app/services/upcdatabase.service";
import { HttpErrorResponse } from "@angular/common/http";

interface InprogresProduct {
  barcode: string;
  name: string;
  location: GrocyLocation | null;
  purchaseQuantityUnits: GrocyQuantityUnit | null;
  consumeQuantityUnits: GrocyQuantityUnit | null;
  quantityUnitFactor: number;
  goodForever: boolean;
  bestBeforeDays: number;
  minStockAmount: number;
  goodForeverAfterOpen: boolean;
  bestBeforeDaysAfterOpen: number;
  goodForeverAfterThawing: boolean;
  bestBeforeDaysAfterThawing: number;
  goodForeverAfterFreezing: boolean;
  bestBeforeDaysAfterFreezing: number;
  createNewParentProduct: boolean;
  newParentProductName: string | null;
  newParentProductMinimumStockAmount: number;
  parentProduct: GrocyProduct | null;
  parent_product_id: string | number | null;
}

const nullProduct: GrocyProduct = {
  id: "-1",
  name: "-- No Parent Product --",
  description: "",
  min_stock_amount: 0,
  quantity_unit_id_stock: -1,
  quantity_unit_id_purchase: -1,
  quantity_unit_factor_purchase_to_stock: 0,
  location_id: 0,
  default_best_before_days: 0,
  default_best_before_days_after_open: 0,
  default_best_before_days_after_thawing: 0,
  default_best_before_days_after_freezing: 0,
  parent_product_id: null
};

@Component({
  selector: "ns-product-quick-create",
  templateUrl: "./product-quick-create.component.html",
  styleUrls: ["./product-quick-create.component.scss"],
  animations: [ slideOutLeftAnimation ]
})
export class ProductQuickCreateComponent {
  // To whoever is reading this, boy did this get away!
  // This is the most painful part of getting people started
  //
  // I swear to god I'm going to rewrite it at some point

  get selectedLocationIdx() {
    return this._selectedLocationIdx;
  }

  set selectedLocationIdx(value) {
    this._selectedLocationIdx = value;
    this.product.location = this.locations[value];
  }

  get selectedProductIdx() {
    return this._selectedProductIdx;
  }

  set selectedProductIdx(value) {
    this._selectedProductIdx = value;
    this.product.parentProduct = this.filteredProducts[value];
  }

  get currentStep() { return this.stepOrder[this.stepIdx]; }
  get locations(): GrocyLocation[] {
    return this._locations;
  }
  set locations(value: GrocyLocation[]) {
    this._locations = value;
    this.locationNames = value.map(l => l.name);
  }

  stepValid = {
    name: () => this.product.name.length > 0 && !this.nameIsTaken(this.product.name),
    location: () => !!this.product.location,
    purchase_quantity: () => !!this.product.purchaseQuantityUnits,
    consume_quantity: () => !!this.product.consumeQuantityUnits,
    quantity_unit_factor: () => this.product.quantityUnitFactor >= 1,
    minimumStockAmount: () => this.product.minStockAmount >= 0,
    bestBeforeDays: () => true,
    parentProduct: () => true,
    earlySave: () => true,
    bestBeforeDaysAfterOpen: () => true,
    bestBeforeDaysAfterThawing: () => this.product.bestBeforeDaysAfterThawing >= 0,
    bestBeforeDaysAfterFreezing: () => this.product.bestBeforeDaysAfterFreezing >= 0,
    saveConfirmation: () => true,
    saving: () => true
  };

  stepOrder = [
    "name",
    "location",
    "purchase_quantity",
    "consume_quantity",
    "quantity_unit_factor",
    "bestBeforeDays",
    "bestBeforeDaysAfterOpen",
    "parentProduct",
    "minimumStockAmount",
    "earlySave",
    "bestBeforeDaysAfterThawing",
    "bestBeforeDaysAfterFreezing",
    "saveConfirmation",
    "saving"
  ];

  stepIdx = 0;
  saveStatus = "";
  alternateNamesSearched = false;
  alternateNames: Record<string, string> = {};
  scannedItemManager: ScannedItemManagerService;
  scannedItems: ScannedItem[] = [];
  idxUnderEdit = -1;
  locationNames: string[] = [];

  products: GrocyProduct[] = [];
  filteredProducts: GrocyProduct[] = [];
  filteredProductNames: string[] = [];

  quantityUnits: GrocyQuantityUnit[] = [];
  quantityUnitNames: string[] = [];

  navigationEnabled = true;

  product: InprogresProduct = this.buildEmptyProduct();

  private _locations: GrocyLocation[] = [];

  private _selectedLocationIdx = 0;
  private _selectedProductIdx = 0;

  constructor(
    private routerExtensions: RouterExtensions,
    private stateTransfer: StateTransferService,
    private grocyService: GrocyService,

    private openFoodFacts: OpenFoodFactsService,
    private upcItemDbService: UPCItemDbService,
    private upcDatabase: UPCDatabaseService
  ) {
    const val = this.stateTransfer.readAndClearState();

    if (val && val.type === "productQuickCreate") {
      this.scannedItemManager = val.scannedItemManager;
      this.scannedItems = val.scannedItems;
    }

    this.grocyService.locations().subscribe(locs => {
      this.locations = locs;
      this.preSelectLocation();
      this.nextScannedItem();
    });

    this.grocyService.allProducts().subscribe(p => {
      this.products = [nullProduct, ...p];
      this.productFilterUpdated("");
    });

    this.grocyService.quantityUnits().subscribe(qus => {
      this.quantityUnits = qus;
      this.quantityUnitNames = qus.map(l => l.name);
    });
  }

  isStepValid(stepName: string) {
    return this.stepValid[stepName]();
  }

  goToStep(stepName: string) {
    this.stepIdx = this.stepOrder.indexOf(stepName);
  }

  nextStepFromParentProduct() {
    this.nextStep(this.hasParentProduct() ? 2 : 1);
  }

  nextStep(by = 1) {
    const stepValidator = this.stepValid[this.stepOrder[this.stepIdx]];

    if (!this.navigationEnabled) {
      console.log("navigation disabled");

      return;
    }

    if (stepValidator && stepValidator()) {
      const newIdx = this.stepIdx + by;

      if (newIdx >= 0 && newIdx < this.stepOrder.length - 1) {
        this.stepIdx = newIdx;
      }
    } else {
      console.log("Step not valid");
    }
  }

  onSwipe(evt: SwipeGestureEventData) {
    if (evt.direction === SwipeDirection.left) {
      this.nextStep();
    } else if (evt.direction === SwipeDirection.right) {
      this.nextStep(-1);
    }
  }

  nextScannedItem() {
    this.idxUnderEdit += 1;
    const nextItem = this.scannedItems[this.idxUnderEdit];

    if (!nextItem) {
      this.routerExtensions.back();
    }

    this.saveStatus = "Getting ready to save";
    this.alternateNamesSearched = false;
    this.alternateNames = {};
    this.product = {
      ...this.buildEmptyProduct(),
      name: nextItem.externalProduct ? nextItem.externalProduct.name : "",
      barcode: nextItem.barcode,
      location: nextItem.location || null
    };

    this.preSelectLocation();
  }

  addBarcodeToExistingProduct() {
    const conflict = this.nameConflicts();

    if (conflict) {
      const loc = this.locations.find(p => Number(p.id) === conflict.location_id);

      this.grocyService.addBarcodeToProduct(conflict.id, this.product.barcode)
      .subscribe(_ => {
        this.updateScannedItem(conflict, loc);
        this.nextScannedItem();
      });
    }
  }

  useName(newName: string) {
    this.product.name = newName;
  }

  nameIsTaken(str: string) {
    return !!this.products.find(p => p.name.toLowerCase() === str.toLowerCase());
  }

  isCurrentUserNameInput(name: string) {
    return name.toLowerCase() === this.product.name.toLowerCase();
  }

  nameConflicts(): GrocyProduct | null {
    return this.products.find(p => this.isCurrentUserNameInput(p.name)) || null;
  }

  preSelectLocation() {
    if (this.product.location) {
      const idx = this.locations.findIndex(
        a => a.id === this.product.location.id
      );

      if (idx) {
        this.selectedLocationIdx = idx;
      }
    }
  }

  valueAdjuster(
    attr: "bestBeforeDays" | "bestBeforeDaysAfterOpen" | "bestBeforeDaysAfterThawing" | "bestBeforeDaysAfterFreezing",
    val: number
  ) {
    this.product[attr] += val;
  }

  onSelectedPurchaseQUChanged(evt: EventData) {
    const picker = <ListPicker>evt.object;
    this.product.purchaseQuantityUnits = this.quantityUnits[picker.selectedIndex];
  }

  onSelectedConsumeQUChanged(evt: EventData) {
    const picker = <ListPicker>evt.object;
    this.product.consumeQuantityUnits = this.quantityUnits[picker.selectedIndex];
  }

  createNewLocation() {
    this.stateTransfer.setState({
      type: "locationCreation",
      callback: l => {
        this.product.location = l;
        this.locations = [l, ...this.locations];
        this.nextStep();
      }
    });

    this.routerExtensions.navigate(["/locations/create"]);
  }

  conditionalConsume() {
    if (this.product.consumeQuantityUnits.id !== this.product.purchaseQuantityUnits.id) {
      this.nextStep();
    } else {
      this.nextStep(2);
    }
  }

  quantityConversionText() {
    if (this.product.consumeQuantityUnits && this.product.purchaseQuantityUnits) {
      return `How many ${this.product.consumeQuantityUnits.name_plural} per ${this.product.purchaseQuantityUnits.name}`;
    } else {
      return `error`;
    }
  }

  productFilterUpdated(filter: string) {
    this.filteredProducts = this.products.filter(i => {
      return i.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    });
    this.filteredProductNames = this.filteredProducts.map(p => p.name);
  }

  updateScannedItem(product: GrocyProduct, location: GrocyLocation) {
    this.scannedItemManager.assignProductToBarcode(
      this.product.barcode,
      product,
      location
    );
  }

  saveProduct() {
    this.goToStep("saving");

    this.createParentProduct().pipe(
      tap(_ => this.saveStatus = "Creating Product"),
        mergeMap(_ => this.createNewProduct()),
        tap(p => this.updateScannedItem(p, this.product.location)),
      tap(_ => this.saveStatus = "Done"),
      catchError((e: Error | HttpErrorResponse) => {
        let errMsg = `There was an error saving the product: ${e.message}`;

        if (e instanceof HttpErrorResponse) {
          errMsg += JSON.stringify(e.error);
        }

        this.saveStatus = errMsg;
        throw e;
      })
    ).subscribe(_ => {
      this.saveStatus = "Product Created";
      setTimeout(() => {
        this.nextScannedItem();
        this.goToStep("name");
      }, 500);
    });

  }

  createNewProduct() {
    return this.grocyService.createProduct({
      ...this.createProductBaseParams(),
      name: this.product.name,
      cumulate_min_stock_amount_of_sub_products: false,
      min_stock_amount: this.product.minStockAmount,
      parent_product_id: this.product.parent_product_id,
    }).pipe(
      switchMap(r => this.grocyService.createProductBarcode({
        product_id: r.id,
        amount: `${this.product.quantityUnitFactor}`,
        qu_id: this.product.purchaseQuantityUnits.id,
        barcode: this.product.barcode,
      }).pipe(mapTo(r))
      )
    );
  }

  hasParentProduct() {
    const pProduct = this.product.parentProduct;

    return (pProduct && pProduct !== nullProduct) ||
      (this.product.createNewParentProduct && this.product.newParentProductName !== "");
  }

  createParentProduct(): Observable<any> {
    const pProduct = this.product.parentProduct;

    if (pProduct && pProduct !== nullProduct) {
      this.product.parent_product_id = pProduct.id;

      return of("");
    } else if (this.product.createNewParentProduct && this.product.newParentProductName !== "") {
      this.saveStatus = "Creating Parent Product";

      return this.grocyService.createProduct({
        ...this.createProductBaseParams(),
        name: this.product.newParentProductName,
        min_stock_amount: this.product.newParentProductMinimumStockAmount,
        cumulate_min_stock_amount_of_sub_products: true
      }).pipe(
      tap(r => {
        this.products = [...this.products, r];
        this.product.parent_product_id = r.id;
        this.product.parentProduct = r;
        this.saveStatus = "Parent Product Created";
      }),
      catchError(e => {
        this.saveStatus = "An error was encountered saving the parent product";
        console.log(e);
        throw e;
      })
      );
    } else {
      return of("");
    }
  }

  numberOfAlternativeNames(): number {
    return Object.keys(this.alternateNames).length;
  }

  findOtherNames() {
    this.alternateNamesSearched = true;
    this.upcDatabase.lookForBarcode(this.product.barcode)
    .subscribe(r => {
      this.alternateNames["UPC Database"] = r.name;
    });

    this.upcItemDbService.lookForBarcode(this.product.barcode)
    .subscribe(r => {
      this.alternateNames["UPC Item DB"] = r.name;
    });

    this.openFoodFacts.searchForBarcode(this.product.barcode)
    .subscribe(r => {
      this.alternateNames["Open Food Facts"] = r.name;
    });
  }

  private createProductBaseParams() {
    return {
      description: "",
      location_id: this.product.location.id,
      quantity_unit_id_purchase: Number(this.product.purchaseQuantityUnits.id),
      quantity_unit_id_stock: Number(this.product.consumeQuantityUnits.id),
      quantity_unit_factor_purchase_to_stock: this.product.quantityUnitFactor,
      default_best_before_days: this.product.goodForever ? -1 : this.product.bestBeforeDays,
      default_best_before_days_after_open: this.product.goodForeverAfterOpen ?
        -1 :
        this.product.bestBeforeDaysAfterOpen,
      default_best_before_days_after_thawing: this.product.goodForeverAfterThawing ?
        -1 :
        this.product.bestBeforeDaysAfterThawing,
      default_best_before_days_after_freezing: this.product.goodForeverAfterFreezing ?
        -1 :
        this.product.bestBeforeDaysAfterFreezing
    };
  }

  private buildEmptyProduct(): InprogresProduct {
    return {
      barcode: "",
      name: "",
      location: null,
      purchaseQuantityUnits: null,
      consumeQuantityUnits: null,
      quantityUnitFactor: 1,
      bestBeforeDays: 0,
      minStockAmount: 0,
      goodForever: false,
      goodForeverAfterOpen: false,
      bestBeforeDaysAfterOpen: 0,
      goodForeverAfterThawing: false,
      bestBeforeDaysAfterThawing: 0,
      goodForeverAfterFreezing: false,
      bestBeforeDaysAfterFreezing: 0,
      createNewParentProduct: false,
      parentProduct: null,
      newParentProductName: null,
      newParentProductMinimumStockAmount: 0,
      parent_product_id: null
    };
  }
}
