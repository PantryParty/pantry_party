import { Component, OnInit, ViewChild, EventEmitter } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyLocation } from "~/app/services/grocy.interfaces";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ModalDialogParams, RouterExtensions } from "nativescript-angular";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular/dataform-directives";

export type LocationSelectorDismiss  = GrocyLocation | null;

@Component({
  selector: "ns-location-creation",
  templateUrl: "./location-creation.component.html"
})
export class LocationCreationComponent {
  @ViewChild("locationCreate", { static: false }) locationForm: RadDataFormComponent;

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
    private routerExtensions: RouterExtensions
  ) { }

  create() {
    this.locationForm.nativeElement.validateAll().then(r => {
      if (r) {
        this.grocyService.createLocation(
          this.grocyLocation.name,
          this.grocyLocation.description,
          this.grocyLocation.isFreezer
        ).subscribe(_ => this.routerExtensions.back());
      }
    });
  }
}
