import { Component  } from "@angular/core";
import { StateTransferService } from "~/app/services/state-transfer.service";
import { BottomSheetParams } from "@nativescript-community/ui-material-bottomsheet/angular";

@Component({
  selector: "ns-external-capture-sheet",
  templateUrl: "./component.html",
  styleUrls: ["./component.css"]
})
export class ExternalCaptureSheetComponent {

  selectionCallback: (x: {text: string}) => any;

  constructor(
    stateTransfer: StateTransferService,
    private params: BottomSheetParams
  ) {
    const passedState = stateTransfer.readAndClearState();
    if (passedState && passedState.type === "externalScanner") {
      this.selectionCallback = passedState.callback;
    }
  }

  close() {
    this.params.closeCallback();
  }

  capturedData(result: {text: string}) {
    this.selectionCallback(result);
  }
}
