import { Component, Input, QueryList, ContentChildren } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FormErrorTextComponent } from "../form-error-text/form-error-text.component";

@Component({
  selector: "ns-date-select-input",
  templateUrl: "./component.html",
  styleUrls: ["./component.scss"]
})
export class DateSelectComponent {
  @Input() control: FormControl;

  @Input() label = "";
  // tslint:disable-next-line:no-input-rename
  @Input("hint") inputHint = "";

  @ContentChildren(FormErrorTextComponent) errorMessages!: QueryList<FormErrorTextComponent>;

  pickerVisible = false;

  errors(): string[] {
    if (!this.control) {
      return [];
    }

    return Object.keys(this.control.errors || {});
  }

  displayText() {
    const value = this.control.value;
    if (value) {
      return value.toDateString();
    } else {
      return "No date selected";
    }
  }

  openPicker() {
    this.pickerVisible = true;
    this.control.markAsTouched();
    this.control.markAsDirty();
  }

  closePicker() {
    this.pickerVisible = false;
    this.control.markAsTouched();
  }
}
