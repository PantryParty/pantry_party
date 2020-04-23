import { Component, OnInit, ViewChild, EventEmitter } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyLocation } from "~/app/services/grocy.interfaces";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ModalDialogParams, RouterExtensions } from "nativescript-angular";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular/dataform-directives";
import { StateTransferService } from "~/app/services/state-transfer.service";

@Component({
  selector: "ns-location-creation",
  templateUrl: "./location-creation.component.html"
})
export class LocationCreationComponent {
  @ViewChild("locationCreate", { static: false }) locationForm: RadDataFormComponent;

  selectionCallback: null | ((x: GrocyLocation) => any)  = null;

  validState = {
    name: false,
    description: true,
    isFreezer: true
  };

  grocyLocation = {
    name: "",
    description: "",
    isFreezer: false
  };

  constructor(
    private grocyService: GrocyService,
    private routerExtensions: RouterExtensions,
    stateTransfer: StateTransferService
  ) {
    const passedState = stateTransfer.readAndClearState();

    if (passedState && passedState.type === "locationCreation") {
      this.selectionCallback = passedState.callback;
    }
  }

  create() {
    this.locationForm.nativeElement.validateAll().then(r => {
      if (r) {
        this.grocyService.createLocation(
          this.grocyLocation.name,
          this.grocyLocation.description,
          this.grocyLocation.isFreezer
        ).subscribe(l => this.locationCreated(l));
      }
    });
  }

  locationCreated(loc: GrocyLocation) {
    if (this.selectionCallback) {
      this.selectionCallback(loc);
      this.routerExtensions.back();
    }
  }
}
