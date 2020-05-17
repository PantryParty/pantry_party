import { Component, OnInit, Output, EventEmitter, ViewContainerRef } from "@angular/core";
import { BarcodeScanner, ScanOptions, ScanResult } from "nativescript-barcodescanner";
import { ExternalScannerService } from "../services/external-scanner.service";
import { Page } from "tns-core-modules/ui/page/page";
import { StateTransferService } from "../services/state-transfer.service";
import { BottomSheetOptions, BottomSheetService } from "nativescript-material-bottomsheet/angular";
import { ExternalCaptureSheetComponent } from "./external-capture-sheet/component";

@Component({
  selector: "ns-scan-selector",
  templateUrl: "./scan-selector.component.html",
  styleUrls: ["./scan-selector.component.scss"]
})
export class ScanSelectorComponent {
  @Output() scanResults = new EventEmitter<{text: string}>();
  @Output() scannerClosed = new EventEmitter<void>();

  enableExternalScanner = false;
  scannerSettings: ScanOptions = {
      formats: "QR_CODE, EAN_13, UPC_A, UPC_E",
      beepOnScan: true,
      reportDuplicates: true,
      preferFrontCamera: false,
      closeCallback: () => this.scannerClosed.emit(),
      showTorchButton: true,
      showFlipCameraButton: true,
      resultDisplayDuration: 0
  };

  private barcodeScanner = new BarcodeScanner();

  constructor(
    public externalScannerService: ExternalScannerService,
    private bottomSheet: BottomSheetService,
    private containerRef: ViewContainerRef,
    private stateTransfer: StateTransferService
  ) {}

  scanOnce(): void {
    this.barcodeScanner.scan(this.scannerSettings)
    .then(r => this.scanResults.emit(r))
    .catch(error => console.log(error));
  }

  scanContiniously(): void {
    this.barcodeScanner.scan({
      ...this.scannerSettings,
      continuousScanCallback: r => this.scanResults.emit(r)
    })
    .catch(error => console.log(error));
  }

  stopScanning() {
    this.enableExternalScanner = false;
  }

  externalScanner() {
    const options: BottomSheetOptions = {
      viewContainerRef: this.containerRef,
      animated: true,
      dismissOnBackgroundTap: true,
      dismissOnDraggingDownSheet: true,
      transparent: true
    };

    this.stateTransfer.setState({
      type: "externalScanner",
      callback: r => this.scanResults.emit(r)
    });

    this.bottomSheet.show(ExternalCaptureSheetComponent, options);
  }

}
