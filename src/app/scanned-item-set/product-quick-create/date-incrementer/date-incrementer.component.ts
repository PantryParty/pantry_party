import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "ns-date-incrementer",
  templateUrl: "./date-incrementer.component.html",
  styleUrls: ["./date-incrementer.component.css"]
})
export class DateIncrementerComponent {
  @Output() addedDays = new EventEmitter<number>();
  @Input() disabled = true;
}
