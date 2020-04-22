import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "ns-location-selector",
  template: "<page-router-outlet></page-router-outlet>"
})
export class LocationSelectorComponent implements OnInit {
  constructor(
    private _routerExtensions: RouterExtensions,
    private _activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._routerExtensions.navigate(["locationSearch"], { relativeTo: this._activeRoute });
  }
}
