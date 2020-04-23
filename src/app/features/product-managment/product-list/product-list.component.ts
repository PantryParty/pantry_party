import { Component, OnInit, ViewContainerRef, Output, EventEmitter } from "@angular/core";
import { GrocyService } from "~/app/services/grocy.service";
import { GrocyProduct } from "~/app/services/grocy.interfaces";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ModalDialogParams, ModalDialogService, ModalDialogOptions } from "nativescript-angular";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { ListViewEventData } from "nativescript-ui-listview";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
  selector: "ns-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit {
  @Output() productSelected = new EventEmitter<GrocyProduct>();
  @Output() productCreated = new EventEmitter<GrocyProduct>();

  products: GrocyProduct[] = [];
  filteredProducts: GrocyProduct[] = [];
  lastSearch = "";

  constructor(
    private grocyService: GrocyService,
    private _modalService: ModalDialogService,
    private _vcRef: ViewContainerRef,
    private page: Page
  ) { }

  ngOnInit(): void {
    this.page.on("navigatedTo", () => {
      this.fetchProducts();
    });
  }

  fetchProducts() {
    return this.grocyService.allProducts().subscribe(r => {
      this.products = r;
      this.filterProducts();
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

  selectProduct(loc: GrocyProduct) {
    this.productSelected.emit(loc);
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(i => {
      return i.name.toLowerCase().indexOf(this.lastSearch.toLowerCase()) > -1;
    });
  }

  createNewProduct() {
    const options: ModalDialogOptions = {
      viewContainerRef: this._vcRef,
      context: {},
      fullscreen: true,
      animated: true
    };

    // this._modalService.showModal(ProductCreatorComponent, options)
    // .then((r: GrocyProduct) => {
    //   if (r) {
    //     this.productCreated.emit(r);
    //   }
    // });
  }
}
