import { Component, OnInit, ViewChild } from "@angular/core";
import { GrocyApiComponent } from "../../settings/grocy-api/grocy-api.component";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "ns-grocy-setup",
  templateUrl: "./grocy-setup.component.html",
  styleUrls: ["./grocy-setup.component.css"]
})
export class GrocySetupComponent implements OnInit {
  isValid = false;

  @ViewChild(GrocyApiComponent, {static: true}) settingsComponent!: GrocyApiComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  saveAndContinue() {
    this.settingsComponent.saveSettings();
    this.router.navigate(
      ["../barcode-sources"],
      { relativeTo: this.route }
    );
  }

}
