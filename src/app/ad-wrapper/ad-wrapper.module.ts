import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { AdWrapperComponent } from "~/app/ad-wrapper/ad-wrapper.component";

@NgModule({
  declarations: [
    AdWrapperComponent
  ],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    AdWrapperComponent
  ]
})
export class AdWrapperModule { }
