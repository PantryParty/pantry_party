import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyLocation } from "~/app/services/grocy.interfaces";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ModalDialogParams, ModalDialogService, ModalDialogOptions } from "nativescript-angular";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { LocationCreatorComponent } from "~/app/location-creation/location-creator.component";

export type LocationSelectorDismiss = GrocyLocation;

@Component({
  selector: "ns-location-selection",
  templateUrl: "./location-selection.component.html",
  styleUrls: ["./location-selection.component.css"]
})
export class LocationSelectionComponent implements OnInit {
  locations: GrocyLocation[] = [];
  filteredLocations: GrocyLocation[] = [];
  lastSearch = "";

  constructor(
    private grocyService: GrocyService,
    private modalParams: ModalDialogParams,
    private _modalService: ModalDialogService,
    private _vcRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.grocyService.locations().subscribe((r) => {
      this.locations = r;
      this.filterLocations();
    });
  }

  searchUpdated($evt: any) {
    this.lastSearch = ($evt.object as SearchBar).text;
    this.filterLocations();
  }

  selectListEntry($event: ItemEventData) {
    this.selectLocation(this.filteredLocations[$event.index]);
  }

  goBack() {
    this.modalParams.closeCallback();
  }

  selectLocation(loc: GrocyLocation) {
    this.modalParams.closeCallback(loc);
  }

  filterLocations() {
    this.filteredLocations = this.locations.filter((i) => {
      return i.name.toLowerCase().indexOf(this.lastSearch.toLowerCase()) > -1;
    });
  }

  createNewLocation() {
    const options: ModalDialogOptions = {
      viewContainerRef: this._vcRef,
      context: {},
      fullscreen: true,
      animated: true
    };

    this._modalService.showModal(LocationCreatorComponent, options)
    .then((r: LocationSelectorDismiss) => {
      if (r) {
        this.selectLocation(r);
      }
    });
  }
}
