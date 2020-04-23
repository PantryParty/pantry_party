import { Routes } from "@angular/router";
import { ScannedItemEditorComponent } from "./scanned-item-editor.component";
import { PRODUCT_SELECTION_ROUTES } from "~/app/product-selection/product-selector-routing.module";

export const SCANNED_ITEM_EDITOR_ROUTES: Routes = [
  {
        path: "scannedItemEditor",
        component: ScannedItemEditorComponent,
        children: [
          ...PRODUCT_SELECTION_ROUTES
        ]
  }
];
