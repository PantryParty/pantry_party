import { Component, OnInit } from "@angular/core";
import { openUrl } from "@nativescript/core/utils/utils";

import * as Admob from "nativescript-admob";
import { Frame } from "tns-core-modules/ui/frame/frame";

@Component({
  selector: "ns-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.css"]
})
export class WelcomeComponent implements OnInit {

  ngOnInit() {
  }

  openGrocy() {
    openUrl("https://grocy.info/");
  }
}
