import { screen } from "tns-core-modules/platform/platform";
import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { SearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { FormBuilder } from "@angular/forms";
import { slideInOutDownAnimation } from "~/app/utilities/animations";
import { debounceTime } from "rxjs/operators";
import { GrocyStockEntry } from "~/app/services/grocy.interfaces";

@Component({
  selector: "ns-stock-filter",
  templateUrl: "./stock-filter.component.html",
  styleUrls: ["./stock-filter.component.scss"],
  animations: [
    slideInOutDownAnimation
  ]
})
export class StockFilterComponent implements OnDestroy {
  @Output() filtersUpdated = new EventEmitter<void>();

  screenWidth = screen.mainScreen.widthPixels;
  filtersVisible = true;

  lastData = {
    productNameContains: "",
    hideChildProducts: true,
    showOnlyBelowMinStock: false,
    withinDaysOfExpiration: ""
  };

  form = this._fb.group({
    productNameContains: [this.lastData.productNameContains],
    hideChildProducts: [this.lastData.hideChildProducts],
    showOnlyBelowMinStock: [this.lastData.showOnlyBelowMinStock],
    withinDaysOfExpiration: [this.lastData.withinDaysOfExpiration]
  });

  subscription = this.form.valueChanges.pipe(
    debounceTime(250)
  ).subscribe(c => {
    this.lastData = c;
    this.filtersUpdated.next();
  });

  constructor(private _fb: FormBuilder) {
  }

  stockItemMatches(item: GrocyStockEntry) {
    if (
      this.lastData.productNameContains.length > 0 &&
      !item.product.name.toLowerCase().includes(this.lastData.productNameContains.toLowerCase())
    ) {
      return false;
    }

    if (
      !this.lastData.hideChildProducts &&
      item.product.parent_product_id
    ) { return false; }

    return true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  formControl(name: string) {
    return this.form.get(name);
  }
}
