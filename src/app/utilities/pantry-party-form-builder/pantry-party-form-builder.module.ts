import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { TextInputComponent } from "./text-input/text-input.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NativeScriptFormsModule } from "nativescript-angular";
import { FormErrorTextComponent } from "./form-error-text/form-error-text.component";

const allComponents = [
  TextInputComponent,
  FormErrorTextComponent
];

@NgModule({
  declarations: allComponents,
  exports: allComponents,
  imports: [
    NativeScriptCommonModule,
    ReactiveFormsModule,
    NativeScriptFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PantryPartyFormBuilderModule { }
