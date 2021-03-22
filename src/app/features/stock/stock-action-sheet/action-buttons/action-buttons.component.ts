import {
  Component,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { GrocyStockEntry } from "~/app/services/grocy.interfaces";

@Component({
  selector: "ns-action-buttons",
  templateUrl: "./action-buttons.component.html",
  styleUrls: ["./action-buttons.component.scss"]
})
export class ActionButtonsComponent {

  @Input() stockItem: GrocyStockEntry;
  @Input() showMessageWhenNoActions: boolean = true;

  @Output() consumeOne = new EventEmitter();
  @Output() consumeAll = new EventEmitter();
  @Output() openOne = new EventEmitter();
  @Output() spoilOne = new EventEmitter();

  canConsume() {
    return this.stockItem.amount > 0;
  }

  canOpen() {
    return this.stockItem.amount - this.stockItem.amount_opened > 0;
  }

  canPerformActions() {
    return this.stockItem.amount > 0;
  }
}
