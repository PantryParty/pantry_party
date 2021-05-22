import { Component, OnInit } from "@angular/core";
import { setBoolean } from "@nativescript/core/application-settings";
import { RouterExtensions } from "@nativescript/angular";

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
