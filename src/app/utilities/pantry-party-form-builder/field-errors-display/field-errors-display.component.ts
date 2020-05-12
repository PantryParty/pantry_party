import { Component, OnInit, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "ns-field-errors",
  template: `
    <Label
      *ngFor="let errMsg of errorMessages"
      [text]="errMsg"
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

  messages() {
    if (this.errorMessages) {
      return this.errorMessages.join(", ");
    }
  }
}
