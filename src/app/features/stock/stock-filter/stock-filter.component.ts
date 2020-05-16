import { screen } from "tns-core-modules/platform/platform";
import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { SearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { FormBuilder } from "@angular/forms";
import { slideInOutDownAnimation } from "~/app/utilities/animations";
import { debounceTime } from "rxjs/operators";
import { GrocyStockEntry } from "~/app/services/grocy.interfaces";
import { StateTransferService } from "~/app/services/state-transfer.service";

export interface StockFilters {
  showChildProducts: boolean;
  showOnlyBelowMinStock: boolean;
  withinDaysOfExpiration: string;
  includeOpenAsOutOfStock: boolean;
  onlyShowOutOfStock: boolean;
  belowMinQuantity: boolean;
}

@Component({
  selector: "ns-stock-filter",
  templateUrl: "./stock-filter.component.html",
  styleUrls: ["./stock-filter.component.scss"],
  animations: [
    slideInOutDownAnimation
  ]
})
export class StockFilterComponent implements OnDestroy {

  form = this._fb.group({
    showChildProducts: [true],
    showOnlyBelowMinStock: [false],
    withinDaysOfExpiration: [""],
    belowMinQuantity: [false],
    onlyShowOutOfStock: [false],
    includeOpenAsOutOfStock: [false]
  });

  subscription = this.form.valueChanges.pipe(
    debounceTime(250)
  ).subscribe(c => this.updatedCallback(c));

  constructor(
    private _fb: FormBuilder,
    private stateTransfer: StateTransferService
  ) {
    const state = this.stateTransfer.readAndClearState();
    if (state.type === "stockFilter") {
      this.updatedCallback = state.callback;

      if (state.currentFilters) {
        this.form.patchValue(state.currentFilters);
      }
    }
  }

  updatedCallback = (s: StockFilters) => {};

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  formControl(name: string) {
    return this.form.get(name);
  }
}
