import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { registerElement } from "nativescript-angular/element-registry";
// import { BarcodeScanner } from "nativescript-barcodescanner";

// registerElement("BarcodeScanner", () => require("nativescript-barcodescanner").BarcodeScannerView);

import { ScanSelectorComponent } from "./scan-selector.component";

@NgModule({
    imports: [
        NativeScriptCommonModule
    ],
    declarations: [
        ScanSelectorComponent
    ],
    exports: [
        ScanSelectorComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ScanSelectorModule { }
