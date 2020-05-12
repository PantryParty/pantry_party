import { Component, Input, QueryList, ContentChildren, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FormErrorTextComponent } from "../form-error-text/form-error-text.component";
import { DEFAULT_ERROR_MESSAGES } from "../error-messages";
import { map, distinctUntilChanged, switchMap, tap, filter } from "rxjs/operators";
import { Observable, Subject, BehaviorSubject, Subscription } from "rxjs";

@Component({
  selector: "ns-text-input",
  templateUrl: "./text-input.component.html",
  styleUrls: ["./text-input.component.scss"]
})
export class TextInputComponent {
  @Input() control: FormControl;

  @Input() label = "";
  // tslint:disable-next-line:no-input-rename
  @Input("hint") inputHint = "";

  @ContentChildren(FormErrorTextComponent) errorStrings!: QueryList<FormErrorTextComponent>;

  errorMessages(): string[] {
    if (!this.control) {
      return [];
    }

    return Object.keys(this.control.errors || {}).map(e => this.getErrorMessages(e));
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
