import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { LocationManagmentRoutingModule } from "./location-managment-routing.module";
import { LocationListComponent } from "./location-list/location-list.component";
import { LocationCreationComponent } from "./location-creation/location-creation.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { AppDrawerOpenerModule } from "~/app/app-drawer-opener/app-drawer-opener.module";
import { AdWrapperModule } from "~/app/ad-wrapper/ad-wrapper.module";
import { PantryPartyFormBuilderModule } from "~/app/utilities/pantry-party-form-builder/pantry-party-form-builder.module";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptCommonModule } from "@nativescript/angular";

@NgModule({
  declarations: [
    LocationListComponent,
    LocationCreationComponent
  ],
  imports: [
    LocationManagmentRoutingModule,
    NativeScriptCommonModule,
    NativeScriptUIListViewModule,
    NativeScriptUIDataFormModule,
    AppDrawerOpenerModule,
    AdWrapperModule,
    PantryPartyFormBuilderModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LocationManagmentModule { }
