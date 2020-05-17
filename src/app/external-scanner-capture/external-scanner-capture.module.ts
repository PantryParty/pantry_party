import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { ExternalScannerCaptureComponent } from "./external-scanner-capture/component";

@NgModule({
  declarations: [ExternalScannerCaptureComponent],
  exports: [ExternalScannerCaptureComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ExternalScannerCaptureModule { }
