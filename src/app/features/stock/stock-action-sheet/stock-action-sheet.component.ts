import { Component, OnInit } from "@angular/core";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { GrocyStockEntry } from "~/app/services/grocy.interfaces";

@Component({
  selector: "ns-stock-action-sheet",
  templateUrl: "./stock-action-sheet.component.html",
  styleUrls: ["./stock-action-sheet.component.css"]
})
export class StockActionSheetComponent {

  stockItem: GrocyStockEntry;

  constructor(
    stateTransfer: StateTransferService
  ) {
    const state = stateTransfer.readAndClearState();

    if (state.type === "stockItemManager") {
      this.stockItem = state.stockItem;
    }
  }

}
