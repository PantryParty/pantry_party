import { Component, OnInit } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyLocation } from "~/app/services/grocy.interfaces";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { RouterExtensions } from "nativescript-angular";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { ListViewEventData } from "nativescript-ui-listview";
import { StateTransferService } from "~/app/services/state-transfer.service";

export interface LocationSelectionResults {
  created: boolean;
  location: GrocyLocation;
}

@Component({
  selector: "ns-location-list",
  templateUrl: "./location-list.component.html",
  styleUrls: ["./location-list.component.scss"]
})
export class LocationListComponent implements OnInit {
  get locations(): GrocyLocation[] {
    return this._locations;
  }
  set locations(value: GrocyLocation[]) {
    this._locations = value;
    this.filterLocations();
  }
  filteredLocations: GrocyLocation[] = [];
  lastSearch = "";

  selectionCallback: null | ((x: LocationSelectionResults) => any)  = null;
  private _locations: GrocyLocation[] = [];

  constructor(
    private grocyService: GrocyService,
    private routedExtensions: RouterExtensions,
    private stateTransfer: StateTransferService
  ) {
    const passedState = stateTransfer.readAndClearState();
    if (passedState && passedState.type === "locationSelection") {
      this.selectionCallback = passedState.callback;
    }
  }

  ngOnInit(): void {
    this.fetchLocations();
  }

  fetchLocations() {
    return this.grocyService.locations().subscribe(r => {
      this.locations = r;
    });
  }

  listPulled(evt: ListViewEventData) {
    this.fetchLocations().add(_ => {
      evt.object.notifyPullToRefreshFinished();
    });
  }

  searchUpdated($evt: any) {
    this.lastSearch = ($evt.object as SearchBar).text;
    this.filterLocations();
  }

  selectListEntry($event: ItemEventData) {
    this.selectLocation(this.filteredLocations[$event.index]);
  }

  selectLocation(loc: GrocyLocation) {
    if (this.selectionCallback) {
      this.selectionCallback({ created: false, location: loc });
      this.routedExtensions.back();
    }
  }

  locationCreated(loc: GrocyLocation) {
    this.locations = [loc, ...this.locations];

    if (this.selectionCallback) {
      this.selectionCallback({ created: true, location: loc });
      this.routedExtensions.back();
    }
  }

  filterLocations() {
    this.filteredLocations = this.locations.filter(i => {
      return i.name.toLowerCase().indexOf(this.lastSearch.toLowerCase()) > -1;
    });
  }

  createNewLocation() {
    this.stateTransfer.setState({
      type: "locationCreation",
      callback: l => this.locationCreated(l)
    });

    this.routedExtensions.navigate(["/locations/create"]);
  }
}
