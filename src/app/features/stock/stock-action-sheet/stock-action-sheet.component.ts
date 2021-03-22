import { Feedback, FeedbackType } from "nativescript-feedback";
import { Component } from "@angular/core";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { GrocyStockEntry } from "~/app/services/grocy.interfaces";
import { pluralize } from "~/app/utilities/pluralize";
import { GrocyService } from "~/app/services/grocy.service";

@Component({
  selector: "ns-stock-action-sheet",
  templateUrl: "./stock-action-sheet.component.html",
  styleUrls: ["./stock-action-sheet.component.scss"]
})
export class StockActionSheetComponent {

  stockItem: GrocyStockEntry;
  childStockItems: GrocyStockEntry[] = [];
  private feedback = new Feedback();

  constructor(
    // stateTransfer: StateTransferService,
    // private grocyService: GrocyService
  ) {
    // const state = stateTransfer.readAndClearState();

    // if (state.type === "stockItemManager") {
    //   this.stockItem = state.stockItem;
    //   this.childStockItems = state.childStockItems;
    // }
  }

  consumeAll(entry: GrocyStockEntry) {
    this.consumeProduct(entry, entry.amount);
  }

  spoilOne(entry: GrocyStockEntry) {
    this.consumeProduct(entry, 1, true);
  }

  openOne(entry: GrocyStockEntry) {
    // this.grocyService.openProduct({
    //   productId: entry.product.id,
    //   quantity: 1
    // }).subscribe(_ => {
    //   this.adjustForOpen(entry.product.id, 1);
    //   this.feedback.show({
    //     title: `Consumed`,
    //     message: `Successfully opened 1 ${entry.product.name}`,
    //     type: FeedbackType.Success
    //   });
    // },
    // e => this.feedback.show({
    //     title: `Error Consuming Product`,
    //     message: e.message,
    //     type: FeedbackType.Error
    // }));
  }

  consumeProduct(entry: GrocyStockEntry, quantity: number, spoiled = false) {
    // this.grocyService.consumeProduct({
    //   productId: entry.product.id,
    //   quantity,
    //   spoiled
    // }).subscribe(_ => {
    //   this.reduceAmount(entry.product.id, quantity);
    //   this.feedback.show({
    //     title: `Consumed`,
    //     message: `Successfully ${spoiled ? "spoiled" : "consumed"} ${quantity} of ${entry.product.name}`,
    //     type: FeedbackType.Success
    //   });
    // },
    // e => this.feedback.show({
    //     title: `Error Consuming Product`,
    //     message: e.message,
    //     type: FeedbackType.Error
    // }));
  }

  adjustForOpen(productId, quantity) {
    // if (this.stockItem.product.id === productId) {
    //   this.stockItem = {
    //     ...this.stockItem,
    //     amount_opened: this.stockItem.amount_opened + quantity,
    //     amount_opened_aggregated: this.stockItem.amount_opened_aggregated + quantity
    //   };
    // }

    // const childProductIdx = this.childStockItems.findIndex(i => i.product.id);
    // if (childProductIdx >= 0) {
    //   const item = this.childStockItems[childProductIdx];
    //   this.childStockItems[childProductIdx] = {
    //     ...item,
    //     amount_opened: item.amount_opened + quantity
    //   };

    //   this.stockItem = {
    //     ...this.stockItem,
    //     amount_opened_aggregated:  this.stockItem.amount_opened_aggregated + quantity
    //   };
    // }
  }
  reduceAmount(productId, quantity) {
    // if (this.stockItem.product.id === productId) {
    //   this.stockItem = {
    //     ...this.stockItem,
    //     amount: this.stockItem.amount - quantity,
    //     amount_aggregated: this.stockItem.amount_aggregated - quantity,
    //     amount_opened: Math.max(0, this.stockItem.amount_opened - quantity),
    //     amount_opened_aggregated: Math.max(0, this.stockItem.amount_opened_aggregated - quantity)
    //   };
    // }

    // const childProductIdx = this.childStockItems.findIndex(i => i.product.id);
    // if (childProductIdx >= 0) {
    //   const item = this.childStockItems[childProductIdx];
    //   this.childStockItems[childProductIdx] = {
    //     ...item,
    //     amount: item.amount - quantity,
    //     amount_opened: Math.max(0, item.amount_opened - quantity)
    //   };

    //   this.stockItem = {
    //     ...this.stockItem,
    //     amount_aggregated: this.stockItem.amount_aggregated - quantity,
    //     amount_opened_aggregated: Math.max(0, this.stockItem.amount_opened_aggregated - quantity)
    //   };
    // }
  }

  stockText(item: GrocyStockEntry, showChildItems = true) {
    const ammount = Number(item.amount_aggregated);
    const opened = Number(item.amount_opened_aggregated);

    if (ammount <= 0) {
      return `Out of stock`;
    }

    let text = `${ammount} in stock`;

    if (opened > 0) {
      text += `, ${opened} ${pluralize(opened, "is", "are")} open`;
    } else {
      text += `, none are open`;
    }

    const numChildren = this.childStockItems.length;
    if (numChildren && showChildItems) {
      text += ` (${numChildren} child ${pluralize(numChildren, "item", "items")})`;
    }

    return text;
  }
}
