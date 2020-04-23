import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { LocationSelectorComponent } from "./location-selector.component";

@NgModule({
  declarations: [LocationSelectorComponent],
  exports: [ LocationSelectorComponent ],
  entryComponents: [ LocationSelectorComponent ],
  imports: [ NativeScriptCommonModule ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LocationModalModule { }
