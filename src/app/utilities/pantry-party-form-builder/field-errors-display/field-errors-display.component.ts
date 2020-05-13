import { Component, OnInit, Input, ChangeDetectionStrategy } from "@angular/core";
import { DEFAULT_ERROR_MESSAGES } from "../error-messages";

@Component({
  selector: "ns-field-errors",
  template: `
    <Label
      *ngFor="let err of errors"
      [text]="errMsg(err)"
      class="field-errors text-danger"
    ></Label>
  `,
  styles: [`
    .field-errors {
      margin-left: 25px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldErrorsDisplayComponent {
  @Input() errorMessages = [];
  @Input() errors = [];

  messages() {
    if (this.errorMessages) {
      return this.errorMessages.join(", ");
    }
  }

  errMsg(validator: string): string {
    const child = this.errorMessages.find(c => c.validator === validator);

    if (child) {
      return child.message;
    } else if (DEFAULT_ERROR_MESSAGES[validator]) {
      return DEFAULT_ERROR_MESSAGES[validator];
    } else {
      return `no validation error message for ${validator}`;
    }
  }
}
