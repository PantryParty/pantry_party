import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { LocationListComponent } from "./location-list/location-list.component";
import { LocationCreationComponent } from "./location-creation/location-creation.component";

const routes: Routes = [
  {
    path: "",
    component: LocationListComponent
  },
  {
    path: "create",
    component: LocationCreationComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class LocationManagmentRoutingModule { }
