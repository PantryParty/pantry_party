import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "ns-product-selector",
  template: "<page-router-outlet></page-router-outlet>"
})
export class ProductSelectorComponent implements OnInit {
  constructor(
    private _routerExtensions: RouterExtensions,
    private _activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._routerExtensions.navigate(["productSearch"], { relativeTo: this._activeRoute });
  }
}
