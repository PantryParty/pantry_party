import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { ScannedItemEditorEntryComponent } from "./scanned-item-editor-entry.component";
import { ScannedItemEditorComponent } from "./scanned-item-editor.component";
import { PantryPartyFormBuilderModule } from "~/app/utilities/pantry-party-form-builder/pantry-party-form-builder.module";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptUIDataFormModule,
    NativeScriptRouterModule,
    PantryPartyFormBuilderModule
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
