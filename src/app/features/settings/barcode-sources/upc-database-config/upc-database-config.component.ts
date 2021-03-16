import { Component, OnInit } from "@angular/core";
import { UPCDatabaseService } from "~/app/services/upcdatabase.service";
import {TextField, EventData} from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";

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
