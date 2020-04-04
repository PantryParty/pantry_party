import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptRouterModule } from "nativescript-angular";

import { LocationSelectionComponent } from "~/app/location-selection/location-selection.component";
import { LocationSelectorComponent } from "~/app/location-selection/location-selector.component";
import { LocationCreationComponent } from "~/app/location-creation/location-creation.component";
import { LocationCreatorComponent } from "~/app/location-creation/location-creator.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptUIDataFormModule,
    NativeScriptRouterModule
  ],
  declarations: [
    LocationSelectionComponent,
    LocationSelectorComponent,
    LocationCreatorComponent,
    LocationCreationComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  entryComponents: [
    LocationSelectorComponent,
    LocationCreatorComponent
  ]
})
export class LocationSelectorModule { }
