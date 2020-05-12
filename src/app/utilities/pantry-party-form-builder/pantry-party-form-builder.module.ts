import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { TextInputComponent } from "./text-input/text-input.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NativeScriptFormsModule } from "nativescript-angular";
import { FormErrorTextComponent } from "./form-error-text/form-error-text.component";
import { NumberInputComponent } from "./number-input/component";
import { SingleSelectInputComponent } from "./single-select-input/component";
import { FieldErrorsDisplayComponent } from "./field-errors-display/field-errors-display.component";

const allComponents = [
  TextInputComponent,
  FormErrorTextComponent,
  NumberInputComponent,
  SingleSelectInputComponent
];

@NgModule({
  declarations: [
    ...allComponents,
    FieldErrorsDisplayComponent
  ],
  exports: allComponents,
  imports: [
    NativeScriptCommonModule,
    ReactiveFormsModule,
    NativeScriptFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PantryPartyFormBuilderModule { }
