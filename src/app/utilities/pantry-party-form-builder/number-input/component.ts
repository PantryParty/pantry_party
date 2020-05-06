import { Component, Input, QueryList, ContentChildren } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DEFAULT_ERROR_MESSAGES } from "../error-messages";
import { FormErrorTextComponent } from "../form-error-text/form-error-text.component";

@Component({
  selector: "ns-number-input",
  templateUrl: "./component.html",
  styleUrls: ["./component.scss"]
})
export class NumberInputComponent {
  @Input() control: FormControl;
  @Input() label = "";

  @ContentChildren(FormErrorTextComponent) errorStrings!: QueryList<FormErrorTextComponent>;

  getErrorMessages(validator: string): string {
    const child = this.errorStrings.find(c => c.validator === validator);

    if (child) {
      return child.message;
    } else if (DEFAULT_ERROR_MESSAGES[validator]) {
      return DEFAULT_ERROR_MESSAGES[validator];
    } else {
      return `no validation error message for ${validator}`;
    }
  }
}
