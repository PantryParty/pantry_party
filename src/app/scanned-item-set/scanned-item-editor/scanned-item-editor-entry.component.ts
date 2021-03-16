import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "ns-scanned-item-editor-entry",
  template: "<page-router-outlet></page-router-outlet>"
})
export class ScannedItemEditorEntryComponent implements OnInit {
  constructor(
    private _routerExtensions: RouterExtensions,
    private _activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._routerExtensions.navigate(["scannedItemEditor"], { relativeTo: this._activeRoute });
  }
}
