import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptRouterModule } from "nativescript-angular";

import { ScannedItemEditorEntryComponent } from "./scanned-item-editor-entry.component";
import { ScannedItemEditorComponent } from "./scanned-item-editor.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptUIDataFormModule,
    NativeScriptRouterModule
  ],
  declarations: [
    ScannedItemEditorComponent,
    ScannedItemEditorEntryComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  entryComponents: [
    ScannedItemEditorComponent,
    ScannedItemEditorEntryComponent
  ]
})
export class ScanedItemEditorModule { }
