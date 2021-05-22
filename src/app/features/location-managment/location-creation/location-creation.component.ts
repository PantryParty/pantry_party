import { Component } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyLocation } from "~/app/services/grocy.interfaces";
import { RouterExtensions } from "@nativescript/angular";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { FormBuilder, Validators } from "@angular/forms";
import { AsyncUniqeName } from "~/app/utilities/validators/async-unique-name";
import { map } from "rxjs/operators";

@Component({
  selector: "ns-location-creation",
  templateUrl: "./location-creation.component.html"
})
export class LocationCreationComponent {

  selectionCallback: null | ((x: GrocyLocation) => any)  = null;

  form = this._fb.group ({
    name: ["",
      [ Validators.required ],
      [
        AsyncUniqeName.createValidator(
          this.grocyService.locations().pipe(map(all => all.map(p => p.name)))
        )
      ]
    ],
    description: [""],
    isFreezer: [false]
  });

  constructor(
    private grocyService: GrocyService,
    private routerExtensions: RouterExtensions,
    private _fb: FormBuilder,
    stateTransfer: StateTransferService
  ) {
    const passedState = stateTransfer.readAndClearState();

    if (passedState && passedState.type === "locationCreation") {
      this.selectionCallback = passedState.callback;
    }
  }

  create() {
    this.grocyService.createLocation(
      this.form.get("name").value,
      this.form.get("description").value,
      this.form.get("isFreezer").value
    ).subscribe(l => this.locationCreated(l));
  }

  locationCreated(loc: GrocyLocation) {
    if (this.selectionCallback) {
      this.selectionCallback(loc);
      this.routerExtensions.back();
    }
  }

  formControl(name: string) {
    return this.form.get(name);
  }
}
