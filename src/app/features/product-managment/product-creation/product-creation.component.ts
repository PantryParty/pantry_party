import { Component, ViewChild, NgZone, OnInit } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyProduct, GrocyLocation, GrocyQuantityUnit } from "~/app/services/grocy.interfaces";
import { RouterExtensions, ModalDialogOptions, ModalDialogService } from "nativescript-angular";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular/dataform-directives";
import { NamedThingSelectorButton } from "~/app/scanned-item-set/named-thing-selector-button";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { FormBuilder, Validators } from "@angular/forms";

export type ProductSelectorDismiss  = GrocyProduct | null;

@Component({
  selector: "ns-product-creation",
  templateUrl: "./product-creation.component.html"
})
export class ProductCreationComponent implements OnInit {
  @ViewChild("productCreate", { static: false }) productForm: RadDataFormComponent;

  quantityUnitsArr: GrocyQuantityUnit[] = [];
  locationsArr: GrocyLocation[] = [];
  selectionCallback: null | ((x: GrocyProduct) => any)  = null;

  locationSelector = new NamedThingSelectorButton<GrocyLocation>(
    "Location",
    () => new Promise<GrocyLocation>((resolve, _) => {
      this.ngZone.run(() => {
        this.statePasser.setState({
          type: "locationSelection",
          callback: r => resolve(r.location)
        });
        this.routedExtensions.navigate(["/locations"]);
      });
    })
  );

  grocyProduct = {
    name: "",
    minStockAccmount: 0,
    bestBeforeDays: 0,
    bestBeforeDaysAfterOpen: 0,
    bestBeforeDaysAfterFreezing: 0,
    bestBeforeDaysAfterThawing: 0,
    quantityUnitPurchase: "",
    quantityUnitStock: "",
    purchaseFator: 1,
    location: 1
  };

  form = this._fb.group ({
    name: ["", Validators.required],
    minStockAccmount: [0, Validators.compose([Validators.required, Validators.min(0)])],
    bestBeforeDays: [0, Validators.compose([Validators.required, Validators.min(-1)])],
    bestBeforeDaysAfterOpen: [0, Validators.compose([Validators.required, Validators.min(-1)])],
    bestBeforeDaysAfterFreezing: [0, Validators.compose([Validators.required, Validators.min(-1)])],
    bestBeforeDaysAfterThawing: [0, Validators.compose([Validators.required, Validators.min(-1)])],
    purchaseFactor: [1, Validators.compose([Validators.required, Validators.min(1)])],
    quantityUnitPurchase: [null, Validators.required],
    quantityUnitConsume: [null, Validators.required],
    defaultLocation: [null, Validators.required]
  });

  constructor(
    private grocyService: GrocyService,
    private routedExtensions: RouterExtensions,
    private ngZone: NgZone,
    private statePasser: StateTransferService,
    private _fb: FormBuilder
  ) {
    const passedState = statePasser.readAndClearState();

    if (passedState && passedState.type === "productCreation") {
      this.selectionCallback = passedState.callback;
      const scannedItem = passedState.forScannedItem;
      if (scannedItem && scannedItem.externalProduct) {
        this.grocyProduct.name = scannedItem.externalProduct.name;
      }
    }
  }

  createNewLocation() {
    this.statePasser.setState({
      type: "locationCreation",
      callback: location => {
        this.locationsArr = [location].concat(this.locationsArr);
        this.formControl("defaultLocation").setValue(location);
      }
    });
    this.routedExtensions.navigate(["/locations/create"]);
  }

  formControl(name: string) {
    return this.form.get(name);
  }

  ngOnInit() {
    this.grocyService.quantityUnits().subscribe(u => this.quantityUnitsArr = u);
    this.grocyService.locations().subscribe(u => this.locationsArr = u);
  }

  create() {
    this.productForm.dataForm.validateAll().then(r => {
      if (r) {
        this.grocyService.createProduct({
          name: this.grocyProduct.name,
          description: "",
          location_id: this.locationId(),
          quantity_unit_id_purchase: Number(this.grocyProduct.quantityUnitPurchase),
          quantity_unit_id_stock: Number(this.grocyProduct.quantityUnitStock),
          quantity_unit_factor_purchase_to_stock: this.grocyProduct.purchaseFator,
          barcodes: [],
          min_stock_amount: this.grocyProduct.minStockAccmount,
          default_best_before_days: this.grocyProduct.bestBeforeDays,
          default_best_before_days_after_open: this.grocyProduct.bestBeforeDaysAfterOpen,
          default_best_before_days_after_thawing: this.grocyProduct.bestBeforeDaysAfterThawing,
          default_best_before_days_after_freezing: this.grocyProduct.bestBeforeDaysAfterFreezing
        }).subscribe(p => this.productCreated(p));
      }
    });
  }

  productCreated(p: GrocyProduct) {
    if (this.selectionCallback) {
      this.selectionCallback(p);
      this.routedExtensions.back();
    }
  }

  private locationId() {

    const value = this.locationSelector.value;

    if (value) {

      return 1;
    }

    return null;
  }
}
