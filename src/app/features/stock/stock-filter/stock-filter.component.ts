import { Component, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { slideInOutDownAnimation } from "~/app/utilities/animations";
import { debounceTime } from "rxjs/operators";
import { StateTransferService } from "~/app/services/state-transfer.service";
import {StockFilters} from "./stock-filter.component.interface";

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
