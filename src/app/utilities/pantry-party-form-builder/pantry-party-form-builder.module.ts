import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { TextInputComponent } from "./text-input/text-input.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NativeScriptFormsModule } from "@nativescript/angular";
import { FormErrorTextComponent } from "./form-error-text/form-error-text.component";
import { NumberInputComponent } from "./number-input/component";
import { SingleSelectInputComponent } from "./single-select-input/component";
import { FieldErrorsDisplayComponent } from "./field-errors-display/field-errors-display.component";
import { SwitchInputComponent } from "./switch-input/component";
import { DateSelectComponent } from "./date-select-input/component";
import { NativeScriptDateTimePickerModule } from "@nativescript/datetimepicker/angular";

const allComponents = [
  TextInputComponent,
  FormErrorTextComponent,
  NumberInputComponent,
  SingleSelectInputComponent,
  SwitchInputComponent,
  DateSelectComponent
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
    NativeScriptFormsModule,
    NativeScriptDateTimePickerModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PantryPartyFormBuilderModule { }
