import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { LocationManagmentRoutingModule } from "./location-managment-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { LocationListComponent } from "./location-list/location-list.component";
import { LocationCreationComponent } from "./location-creation/location-creation.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular/listview-directives";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular/dataform-directives";

@NgModule({
  declarations: [
    LocationListComponent,
    LocationCreationComponent
  ],
  imports: [
    LocationManagmentRoutingModule,
    NativeScriptCommonModule,
    NativeScriptUIListViewModule,
    NativeScriptUIDataFormModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LocationManagmentModule { }
