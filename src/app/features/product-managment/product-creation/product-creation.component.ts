import { Component,  OnInit } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyProduct, GrocyLocation, GrocyQuantityUnit } from "~/app/services/grocy.interfaces";
import { RouterExtensions } from "nativescript-angular";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { FormBuilder, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { AsyncUniqeName } from "~/app/utilities/validators/async-unique-name";

export type ProductSelectorDismiss  = GrocyProduct | null;

@Component({
  selector: "ns-product-creation",
  templateUrl: "./product-creation.component.html"
})
export class ProductCreationComponent implements OnInit {
  quantityUnitsArr: GrocyQuantityUnit[] = [];
  locationsArr: GrocyLocation[] = [];
  selectionCallback: null | ((x: GrocyProduct) => any)  = null;

  form = this._fb.group ({
    name: ["",
      [ Validators.required ],
      [
        AsyncUniqeName.createValidator(
          this.grocyService.allProducts().pipe(map(all => all.map(p => p.name)))
        )
      ]
    ],
    minStockAccmount: [0, [Validators.required, Validators.min(0)]],
    bestBeforeDays: [0, [Validators.required, Validators.min(-1)]],
    bestBeforeDaysAfterOpen: [0, [Validators.required, Validators.min(-1)]],
    bestBeforeDaysAfterFreezing: [0, [Validators.required, Validators.min(-1)]],
    bestBeforeDaysAfterThawing: [0, [Validators.required, Validators.min(-1)]],
    purchaseFactor: [1, [Validators.required, Validators.min(1)]],
    quantityUnitPurchase: [null, Validators.required],
    quantityUnitConsume: [null, Validators.required],
    defaultLocation: [null, Validators.required]
  });

  constructor(
    private grocyService: GrocyService,
    private routedExtensions: RouterExtensions,
    private statePasser: StateTransferService,
    private _fb: FormBuilder
  ) {
    console.log("constructor");
    const passedState = statePasser.readAndClearState();

    if (passedState && passedState.type === "productCreation") {
      this.selectionCallback = passedState.callback;
      const scannedItem = passedState.forScannedItem;
      if (scannedItem && scannedItem.externalProduct) {
        this.formControl("name").setValue(scannedItem.externalProduct.name);
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
    this.grocyService.createProduct({
      name: this.formControl("name").value,
      description: "",
      location_id: this.formControl("defaultLocation").value.id,
      quantity_unit_id_purchase: Number(this.formControl("quantityUnitPurchase").value.id),
      quantity_unit_id_stock: Number(this.formControl("quantityUnitConsume").value.id),
      quantity_unit_factor_purchase_to_stock: this.formControl("purchaseFactor").value,
      barcodes: [],
      min_stock_amount: this.formControl("minStockAccmount").value,
      default_best_before_days: this.formControl("bestBeforeDays").value,
      default_best_before_days_after_open: this.formControl("bestBeforeDaysAfterOpen").value,
      default_best_before_days_after_thawing: this.formControl("bestBeforeDaysAfterThawing").value,
      default_best_before_days_after_freezing: this.formControl("bestBeforeDaysAfterFreezing").value
    }).subscribe(p => this.productCreated(p));
  }

  productCreated(p: GrocyProduct) {
    if (this.selectionCallback) {
      this.selectionCallback(p);
      this.routedExtensions.back();
    }
  }
}
