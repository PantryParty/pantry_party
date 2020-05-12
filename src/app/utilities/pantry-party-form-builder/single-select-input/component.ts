import { Component, Input, QueryList, ContentChildren, EventEmitter, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DEFAULT_ERROR_MESSAGES } from "../error-messages";
import { FormErrorTextComponent } from "../form-error-text/form-error-text.component";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { EventData } from "tns-core-modules/ui/page/page";
import { SearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { Subscription } from "rxjs";

@Component({
  selector: "ns-single-select-input",
  templateUrl: "./component.html",
  styleUrls: ["./component.scss"]
})
export class SingleSelectInputComponent<T> {
  get options(): T[] {
    return this._options;
  }
  @Input()
  set options(value: T[]) {
    this._options = value;
    this.filterItems();
  }

  @Input() control: FormControl;
  @Input() label = "";
  @Input() textKey = "name";
  @Input() nounName: string = "";
  @Input() allowsCreate = false;

  @Output() createTriggerd = new EventEmitter<void>();
  @Output() changed = new EventEmitter<void>();

  @ContentChildren(FormErrorTextComponent) errorMessages!: QueryList<FormErrorTextComponent>;

  pickerVisible = false;
  selectedIndex = 0;
  lastSearch = "";
  filteredItems: T[] = [];

  private _options: T[] = [];

  startCreate() {
    this.closePicker();
    this.createTriggerd.emit();
  }

  searchUpdated($evt: any) {
    this.lastSearch = ($evt.object as SearchBar).text.toLowerCase();
    this.filterItems();
  }

  filterItems() {
    this.filteredItems = this.options.filter(
      i => i[this.textKey].toLowerCase().includes(this.lastSearch)
    );
  }

  optionNames() {
    return this.filteredItems.map(o => o[this.textKey]);
  }

  openPicker() {
    this.filterItems();
    this.pickerVisible = true;
    this.control.markAsTouched();
    this.control.markAsDirty();
  }

  closePicker() {
    this.pickerVisible = false;
    this.control.markAsTouched();
    this.lastSearch = "";
  }

  select() {
    this.control.setValue(this.filteredItems[this.selectedIndex]);
    this.closePicker();
    this.changed.emit();
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

  errors(): string[] {
    if (!this.control) {
      return [];
    }

    return Object.keys(this.control.errors || {});
  }
}
