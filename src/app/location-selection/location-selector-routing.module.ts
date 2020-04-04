import { Routes } from "@angular/router";

import { LocationSelectionComponent } from "~/app/location-selection/location-selection.component";
import { LocationCreationComponent } from "~/app/location-creation/location-creation.component";

export const LOCATION_SELECTION_ROUTES: Routes = [
  {
    path: "locationSearch",
    component: LocationSelectionComponent,
    children: [
      {
        path: "locationCreation", component: LocationCreationComponent
      }
    ]
  }
];
