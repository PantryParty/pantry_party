import { Routes } from "@angular/router";
import { ScannedItemEditorComponent } from "./scanned-item-editor.component";
import { LOCATION_SELECTION_ROUTES } from "~/app/location-selection/location-selector-routing.module";
import { PRODUCT_SELECTION_ROUTES } from "~/app/product-selection/product-selector-routing.module";

export const SCANNED_ITEM_EDITOR_ROUTES: Routes = [
  {
        path: "scannedItemEditor",
        component: ScannedItemEditorComponent,
        children: [
          ...LOCATION_SELECTION_ROUTES,
          ...PRODUCT_SELECTION_ROUTES
        ]
  }
];
