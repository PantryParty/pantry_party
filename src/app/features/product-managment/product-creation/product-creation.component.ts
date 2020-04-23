import { Component, ViewChild, NgZone } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyProduct, GrocyLocation } from "~/app/services/grocy.interfaces";
import { RouterExtensions, ModalDialogOptions, ModalDialogService } from "nativescript-angular";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular/dataform-directives";
import { NamedThingSelectorButton } from "~/app/scanned-item-set/named-thing-selector-button";
import { StateTransferService } from "~/app/services/state-transfer.service";

export type ProductSelectorDismiss  = GrocyProduct | null;

@Component({
  selector: "ns-product-creation",
  templateUrl: "./product-creation.component.html"
})
export class ProductCreationComponent {
  @ViewChild("productCreate", { static: false }) productForm: RadDataFormComponent;

  quantityUnits: Map<string, string> = new Map([]);

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

  constructor(
    private grocyService: GrocyService,
    private routedExtensions: RouterExtensions,
    private ngZone: NgZone,
    private statePasser: StateTransferService

  ) {
    // const scannedItem = this.modalParams.context.scannedItem;
    // if (scannedItem && scannedItem.externalProduct) {
    //   this.grocyProduct.name = scannedItem.externalProduct.name;
    // }
  }

  ngOnInit() {
    this.grocyService.quantityUnits().subscribe(u => {
      this.quantityUnits = new Map(u.map(i => [i.id, i.name]));
    });
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
        }).subscribe(_ => this.routedExtensions.back());
      }
    });
  }

  private locationId() {

    const value = this.locationSelector.value;

    if (value) {

      return 1;
    }

    return null;
  }
}
