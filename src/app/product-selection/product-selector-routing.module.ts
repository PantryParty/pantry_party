import { Routes } from "@angular/router";

import { ProductSelectionComponent } from "~/app/product-selection/product-selection.component";
import { ProductCreationComponent } from "~/app/product-creation/product-creation.component";

export const PRODUCT_SELECTION_ROUTES: Routes = [
  {
    path: "productSearch",
    component: ProductSelectionComponent,
    children: [
      {
        path: "productCreation", component: ProductCreationComponent
      }
    ]
  }
];
