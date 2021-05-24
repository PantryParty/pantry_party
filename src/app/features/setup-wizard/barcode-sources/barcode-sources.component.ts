import { Component, OnInit } from "@angular/core";
import {RouterExtensions} from "@nativescript/angular";
import {setBoolean} from "@nativescript/core/application-settings";

@Component({
  selector: "ns-barcode-sources-setup",
  templateUrl: "./barcode-sources.component.html",
  styleUrls: ["./barcode-sources.component.css"]
})
export class BarcodeSourcesComponent implements OnInit {

  constructor(private routerExtension: RouterExtensions) { }

  ngOnInit(): void {
  }

  completeStep() {
    setBoolean("app.setupComplete", true);

    this.routerExtension.navigate(
      ["/"],
      {clearHistory: true}
    );
  }

}
