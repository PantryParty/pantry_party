import { Component, OnInit } from "@angular/core";
import { UPCDatabaseService } from "~/app/services/upcdatabase.service";
import { TextField } from "tns-core-modules/ui/text-field";
import { EventData } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";

@Component({
  selector: "ns-upc-database-config",
  templateUrl: "./upc-database-config.component.html",
  styleUrls: ["./upc-database-config.component.css"]
})
export class UpcDatabaseConfigComponent {

  get currentAPIKey() {
    return this.upcDatabase.apiKey;
  }

  constructor(
    private upcDatabase: UPCDatabaseService,
    private routerExtensions: RouterExtensions
  ) {}

  onBlur(evt: EventData) {
    const textField = evt.object as TextField;
    this.upcDatabase.apiKey = textField.text;
  }
}
