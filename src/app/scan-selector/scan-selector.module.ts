import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { ScanSelectorComponent } from "./scan-selector.component";
import { ExternalScannerCaptureModule } from "../external-scanner-capture/external-scanner-capture.module";
import { ExternalCaptureSheetComponent } from "./external-capture-sheet/component";
import { NativeScriptMaterialRippleModule } from "@nativescript-community/ui-material-ripple/angular";

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
