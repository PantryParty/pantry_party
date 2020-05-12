import { Component, Input, QueryList, ContentChildren } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FormErrorTextComponent } from "../form-error-text/form-error-text.component";

@Component({
  selector: "ns-switch-input",
  templateUrl: "./component.html",
  styleUrls: ["./component.scss"]
})
export class SwitchInputComponent {
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
