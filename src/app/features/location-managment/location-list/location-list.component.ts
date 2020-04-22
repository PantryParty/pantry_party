import { Component, OnInit, ViewContainerRef, Output, EventEmitter } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyLocation } from "~/app/services/grocy.interfaces";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ModalDialogParams, ModalDialogService, ModalDialogOptions } from "nativescript-angular";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { ListViewEventData } from "nativescript-ui-listview";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
  selector: "ns-location-list",
  templateUrl: "./location-list.component.html",
  styleUrls: ["./location-list.component.css"]
})
export class LocationListComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<GrocyLocation>();
  @Output() locationCreated = new EventEmitter<GrocyLocation>();

  locations: GrocyLocation[] = [];
  filteredLocations: GrocyLocation[] = [];
  lastSearch = "";

  constructor(
    private grocyService: GrocyService,
    private _modalService: ModalDialogService,
    private _vcRef: ViewContainerRef,
    private page: Page
  ) { }

  ngOnInit(): void {
    this.page.on("navigatedTo", () => {
      this.fetchLocations();
    });
  }

  fetchLocations() {
    return this.grocyService.locations().subscribe(r => {
      this.locations = r;
      this.filterLocations();
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
    this.locationSelected.emit(loc);
  }

  filterLocations() {
    this.filteredLocations = this.locations.filter(i => {
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

    // this._modalService.showModal(LocationCreatorComponent, options)
    // .then((r: GrocyLocation) => {
    //   if (r) {
    //     this.locationCreated.emit(r);
    //   }
    // });
  }
}
