import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { TextField } from "@nativescript/core";
import { Page } from "@nativescript/core";

@Component({
  selector: "ns-external-scanner-capture",
  templateUrl: "./component.html",
  styleUrls: ["./component.css"]
})
export class ExternalScannerCaptureComponent {

  @Input()
  get capture(): boolean {
    return this._capture;
  }
  set capture(value: boolean) {
    this._capture = value;

    if (value) {
      this.doCapture();
    }
  }

  @ViewChild("captureField", {static: true}) captureField: {nativeElement: TextField };

  @Output() capturedData = new EventEmitter<{text: string}>();

  private onPage = true;

  private _capture: boolean = false;

  constructor(
    private page: Page
  ) {
    this.page.on("navigatingFrom", () => this.onPage = false);
    this.page.on("navigatingTo", () => {
      this.onPage = true;
      this.doCapture();
    });
  }

  returnPress() {
   this.done();
  }

  blur() {
    this.done();
  }

  done() {
    const text = this.captureField.nativeElement.text;
    this.captureField.nativeElement.text = "";

    if (text !== "") {
      this.capturedData.emit({text});
    }

    this.doCapture();
  }

  doCapture() {
    if (this.capture && this.onPage) {
      this.captureField.nativeElement.focus();
    }
  }
}
