import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { ScanSelectorComponent } from "./scan-selector.component";
import { ExternalScannerCaptureModule } from "../external-scanner-capture/external-scanner-capture.module";
import { NativeScriptMaterialRippleModule } from "nativescript-material-ripple/angular";
import { ExternalCaptureSheetComponent } from "./external-capture-sheet/component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    ExternalScannerCaptureModule,
    NativeScriptMaterialRippleModule
  ],
  declarations: [
    ScanSelectorComponent,
    ExternalCaptureSheetComponent
  ],
  exports: [
    ScanSelectorComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  entryComponents: [
    ExternalCaptureSheetComponent
  ]
})
export class ScanSelectorModule { }
