import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from "@angular/core";
import { openUrl } from "@nativescript/core/utils/utils";
import { BehaviorSubject, of, ReplaySubject, interval } from "rxjs";
import { debounceTime, filter, switchMap, catchError, map, tap, takeUntil } from "rxjs/operators";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular/dataform-directives";
import { GrocyService, GrocySystemInfoResponse } from "~/app/services/grocy.service";
import { HttpErrorResponse } from "@angular/common/http";

type responseRender =
    {result: "success", resp: GrocySystemInfoResponse }
  | { result: "error", err: HttpErrorResponse };

@Component({
  selector: "ns-grocy-api",
  templateUrl: "./grocy-api.component.html",
  styleUrls: ["./grocy-api.component.css"]
})
export class GrocyApiComponent implements OnInit, OnDestroy {

  get helpText() {
    return this.helpTextForStatus[this.lastHttpError.status] ||
      `An unknown error occurred. Got HTTP Status code ${this.lastHttpError.status}`;
  }
  @ViewChild("configForm", { static: false }) configForm: RadDataFormComponent;
  @Output() configValid = new EventEmitter<boolean>();

  working = false;

  apiConfig = {
    url: this.grocyService.apiHost,
    apiKey: this.grocyService.apiKey
  };

  lastHttpError: HttpErrorResponse| null = null;
  grocyVersion: null | string = null;

  helpTextForStatus = {
    0: "A network error was encountered. Please check your internet connection and try again.",
    401: "Your API key appears to be invalid.",
    403: "Your API key appears to be invalid.",
    404: "Server responded with not-found, please check the configuration"
  };
  private ngUnsubscribe = new ReplaySubject<true>();

  private changes = new BehaviorSubject(true);

  constructor(private grocyService: GrocyService) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
  }

  ngOnInit(): void {

    // interval(1000).pipe(
    //   takeUntil(this.ngUnsubscribe),
    //   switchMap(() => this.configForm.dataForm.validateAll())
    // ).subscribe(() => {});

    this.changes.pipe(
      takeUntil(this.ngUnsubscribe),
      debounceTime(250),
      filter(() =>  !!this.configForm && this.apiConfig.url !== "" && this.apiConfig.apiKey !== ""),
      switchMap(() => this.configForm.dataForm.validateAll()),
      tap((v) => v || this.configValid.emit(false)),
      filter((v) => !!v),
      tap(() => this.working = true),
      switchMap(() => this.grocyService.getSystemInfo(
        this.apiConfig.url,
        this.apiConfig.apiKey
      ).pipe(
      map((r) => ({result: "success" as "success", resp: r})),
      catchError((e: HttpErrorResponse) => of({result: "error" as "error", err: e}))
      )),
      tap(() => this.working = false)
    ).subscribe((r) =>  this.renderReturn(r));
  }

  renderReturn(resp: responseRender) {
    this.configValid.emit(resp.result === "success");

    if (resp.result === "error") {
      this.grocyVersion = null;
      this.lastHttpError = resp.err;
    } else {
      this.grocyVersion = resp.resp.grocy_version.Version;
      this.lastHttpError = null;
    }
  }

  propertyCommitted() {
    this.changes.next(true);
  }

  openAPIKeyUrl() {
    openUrl(this.manageKeysUrl());
  }

  apiKeyText() {
    return `Get API Keys at ${this.manageKeysUrl()}`;
  }

  manageKeysUrl() {
    return `${this.hostWithoutAPI()}/manageapikeys`;
  }

  hostWithoutAPI() {
    return this.apiConfig.url.replace(/\/api$/, "");
  }

  saveSettings() {
    this.grocyService.apiKey = this.apiConfig.apiKey;
    this.grocyService.apiHost = this.apiConfig.url;
  }
}
