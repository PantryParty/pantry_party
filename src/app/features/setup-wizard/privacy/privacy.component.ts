import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { setBoolean } from "tns-core-modules/application-settings/application-settings";

@Component({
  selector: "ns-privacy",
  templateUrl: "./privacy.component.html",
  styleUrls: ["./privacy.component.css"]
})
export class PrivacyComponent {

  constructor(private routerExtension: RouterExtensions) { }

  completeStep() {
    setBoolean("app.setupComplete", true);

    this.routerExtension.navigate(
      ["/"],
      {clearHistory: true}
    );
  }

}
