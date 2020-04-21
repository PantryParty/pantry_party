import { GrocyApiComponent } from "./grocy-api.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ViewChild, Component } from "@angular/core";

@Component({
  selector: "ns-grocy-api-wrapper",
  template: `
  <ActionBar title="Grocy API">
    <NavigationButton></NavigationButton>
    <ActionItem
      ios.position="right"
      (tap)="saveAndContinue()"
      *ngIf="isValid"
      >
      <Label text="Save" ></Label>
    </ActionItem>
  </ActionBar>

  <ns-grocy-api (configValid)="isValid = $event"></ns-grocy-api>
  `
})
export class GrocyApiWrapperComponent {
  isValid = false;

  @ViewChild(GrocyApiComponent, {static: true}) settingsComponent!: GrocyApiComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  saveAndContinue() {
    this.settingsComponent.saveSettings();
    this.router.navigate(
      ["../barcode-sources"],
      { relativeTo: this.route }
    );
  }
}
