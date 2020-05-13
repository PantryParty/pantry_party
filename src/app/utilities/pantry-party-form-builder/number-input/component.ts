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
  // tslint:disable-next-line:no-input-rename
  @Input("hint") inputHint = "";

  @ContentChildren(FormErrorTextComponent) errorMessages!: QueryList<FormErrorTextComponent>;

  errors(): string[] {
    if (!this.control) {
      return [];
    }

    return Object.keys(this.control.errors || {});
  }
}
