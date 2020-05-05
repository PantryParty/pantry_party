import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "ns-form-error-text",
  template: "",
  styleUrls: []
})
export class FormErrorTextComponent {
  @Input() validator = "";
  @Input() message = "";
}
