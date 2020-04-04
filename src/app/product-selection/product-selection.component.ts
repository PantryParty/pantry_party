import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyProduct } from "~/app/services/grocy.interfaces";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ModalDialogParams, ModalDialogService, ModalDialogOptions } from "nativescript-angular";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { ProductCreatorComponent } from "../product-creation/product-creator.component";

export type ProductSelectorDismiss = GrocyProduct | null;

@Component({
  selector: "ns-product-selection",
  templateUrl: "./product-selection.component.html",
  styleUrls: ["./product-selection.component.css"]
})
export class ProductSelectionComponent implements OnInit {
  products: GrocyProduct[] = [];
  filteredProducts: GrocyProduct[] = [];
  lastSearch = "";

  constructor(
    private grocyService: GrocyService,
    private modalParams: ModalDialogParams,
    private _modalService: ModalDialogService,
    private _vcRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.grocyService.allProducts().subscribe((r) => {
      this.products = r;
      this.filterProducts();
    });
  }

  searchUpdated($evt: any) {
    this.lastSearch = ($evt.object as SearchBar).text;
    this.filterProducts();
  }

  selectListEntry($event: ItemEventData) {
    this.selectProduct(this.filteredProducts[$event.index]);
  }

  goBack() {
    this.modalParams.closeCallback();
  }

  selectProduct(loc: GrocyProduct) {
    this.modalParams.closeCallback(loc);
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((i) => {
      return i.name.toLowerCase().indexOf(this.lastSearch.toLowerCase()) > -1;
    });
  }

  createNewProduct() {
    const options: ModalDialogOptions = {
      viewContainerRef: this._vcRef,
      context: this.modalParams.context,
      fullscreen: true,
      animated: true
    };

    this._modalService.showModal(ProductCreatorComponent, options)
    .then((r: ProductSelectorDismiss) => {
      if (r) {
        this.selectProduct(r);
      }
    });
  }
}
