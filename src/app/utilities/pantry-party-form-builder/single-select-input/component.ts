import { Component, Input, QueryList, ContentChildren } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DEFAULT_ERROR_MESSAGES } from "../error-messages";
import { FormErrorTextComponent } from "../form-error-text/form-error-text.component";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { EventData } from "tns-core-modules/ui/page/page";

@Component({
  selector: "ns-single-select-input",
  templateUrl: "./component.html",
  styleUrls: ["./component.scss"]
})
export class SingleSelectInputComponent<T> {
  @Input() control: FormControl;
  @Input() label = "";
  @Input() options: T[] = [];
  @Input() textKey = "name";
  @Input() nounName: string = "";

  @ContentChildren(FormErrorTextComponent) errorStrings!: QueryList<FormErrorTextComponent>;

  pickerVisible = false;
  selectedIndex = 0;

  optionNames() {
    return this.options.map(o => o[this.textKey]);
  }

  togglePicker() {
    this.pickerVisible = !this.pickerVisible;
  }

  select() {
    this.control.setValue(this.options[this.selectedIndex]);
    this.pickerVisible = false;
  }

  onSelectedIndexChanged(evt: EventData) {
    const picker = <ListPicker>evt.object;
    this.selectedIndex = picker.selectedIndex;
  }

  displayText() {
    const value = this.currentValue();
    if (value) {
      return value[this.textKey];
    } else if (this.nounName.length) {
      return `No ${this.nounName} selected`;
    } else {
      return "Nothing selected";
    }
  }

  currentValue() {
    if (!this.control) {
      return null;
    }

    return this.control.value;
  }

  setValue(val: T) {
    if (this.control) {
      this.control.setValue(val);
    }
  }

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
