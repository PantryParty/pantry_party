import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { ScannedItem } from "~/app/scanned-item-set/services/scanned-item-manager.service";
import { ItemEventData } from "@nativescript/core";
import { SwipeGestureEventData } from "@nativescript/core";

export interface SwipeOnItemData {
  item: ScannedItem;
  $event: SwipeGestureEventData;
}

@Component({
  selector: "ns-scanned-item-list",
  templateUrl: "./scanned-item-list.component.html",
  styleUrls: ["./scanned-item-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScannedItemListComponent {
  @Input() items: ScannedItem[] = [];
  @Input() pausedItems: Record<string, boolean> = {};
  @Input() workingItems: Record<string, boolean> = {};
  @Input() respectsPurchaseFactor = false;

  @Output() itemPauseToggled = new EventEmitter<ScannedItem>();
  @Output() itemTapped = new EventEmitter<ScannedItem>();
  @Output() swipeOnItem = new EventEmitter<SwipeOnItemData>();

  onItemTap(evt: ItemEventData) {
    this.itemTapped.emit(this.items[evt.index]);
  }

  onSwipe($event: SwipeGestureEventData, item: ScannedItem) {
    this.swipeOnItem.emit({item, $event});
  }
}
