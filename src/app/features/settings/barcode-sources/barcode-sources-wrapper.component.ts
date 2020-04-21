import { Component} from "@angular/core";

@Component({
  selector: "ns-barcode-sources-wrapper",
  template: `
    <ActionBar title="Barcode Data">
      <NavigationButton></NavigationButton>
    </ActionBar>
    <ns-barcode-sources></ns-barcode-sources>
  `
})
export class BarcodeSourcesWrapperComponent {

}
