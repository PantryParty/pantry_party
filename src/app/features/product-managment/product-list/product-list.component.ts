import { Component, OnInit, ViewContainerRef, Output, EventEmitter } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyProduct } from "~/app/services/grocy.interfaces";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ModalDialogParams, ModalDialogService, ModalDialogOptions, RouterExtensions } from "nativescript-angular";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { ListViewEventData } from "nativescript-ui-listview";
import { StateTransferService } from "~/app/services/state-transfer.service";

export interface ProductSelectionResults {
  created: boolean;
  product: GrocyProduct;
}

@Component({
  selector: "ns-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit {
  get products(): GrocyProduct[] {
    return this._products;
  }
  set products(value: GrocyProduct[]) {
    this._products = value;
    this.filterProducts();
  }

  filteredProducts: GrocyProduct[] = [];
  lastSearch = "";
  selectionCallback: null | ((x: ProductSelectionResults) => any)  = null;

  private _products: GrocyProduct[] = [];

  constructor(
    private grocyService: GrocyService,
    private stateTransfer: StateTransferService,
    private routerExtensions: RouterExtensions
  ) {
    const passedState = stateTransfer.readAndClearState();
    if (passedState && passedState.type === "productSelection") {
      this.selectionCallback = passedState.callback;
    }
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    return this.grocyService.allProducts().subscribe(r => {
      this.products = r;
    });
  }

  listPulled(evt: ListViewEventData) {
    this.fetchProducts().add(_ => {
      evt.object.notifyPullToRefreshFinished();
    });
  }

  searchUpdated($evt: any) {
    this.lastSearch = ($evt.object as SearchBar).text;
    this.filterProducts();
  }

  selectListEntry($event: ItemEventData) {
    this.selectProduct(this.filteredProducts[$event.index]);
  }

  selectProduct(product: GrocyProduct) {
    if (this.selectionCallback) {
      this.selectionCallback({created: false, product});
      this.routerExtensions.back();
    }
  }

  productCreated(product: GrocyProduct) {
    this.products = [product, ...this.products];

    if (this.selectionCallback) {
      this.selectionCallback({created: true, product});
      this.routerExtensions.back();
    }
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(i => {
      return i.name.toLowerCase().indexOf(this.lastSearch.toLowerCase()) > -1;
    });
  }

  createNewProduct() {
    this.stateTransfer.setState({
      type: "productCreation",
      callback: p => this.productCreated(p)
    });
    this.routerExtensions.navigate(["/products/create"]);
  }
}
