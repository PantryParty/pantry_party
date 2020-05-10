import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from "@angular/core";
import { openUrl } from "@nativescript/core/utils/utils";
import { BehaviorSubject, of, ReplaySubject, merge } from "rxjs";
import { debounceTime, filter, switchMap, catchError, map, tap, takeUntil } from "rxjs/operators";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular/dataform-directives";
import { GrocyService, GrocySystemInfoResponse } from "~/app/services/grocy.service";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";

type responseRender =
    {result: "success", resp: GrocySystemInfoResponse }
  | { result: "error", err: HttpErrorResponse };

@Component({
  selector: "ns-grocy-api",
  templateUrl: "./grocy-api.component.html",
  styleUrls: ["./grocy-api.component.css"]
})
export class GrocyApiComponent implements OnInit, OnDestroy {
  hassHelpText = "This error is usually associated with HASS.IO install. Tap for instructions to setup";

  get helpText() {
    return this.helpTextForStatus[this.lastHttpError.status] ||
      `An unknown error occurred. Got HTTP Status code ${this.lastHttpError.status}`;
  }
  @ViewChild("configForm", { static: false }) configForm: RadDataFormComponent;
  @Output() configValid = new EventEmitter<boolean>();

  working = false;

  lastHttpError: HttpErrorResponse| null = null;
  lastHttpResponseSuccess = false;
  grocyVersion: null | string = null;

  helpTextForStatus = {
    0: "A network error was encountered. Please check your internet connection and try again.",
    401: "Your API key appears to be invalid.",
    403: "Your API key appears to be invalid.",
    404: "Server responded with not-found, please check the configuration"
  };

  form = this._fb.group ({
    url: [this.grocyService.apiHost, Validators.compose([
      Validators.required,
      Validators.pattern(/^https?:\/\/.*\/api$/i)
      ])
    ],
    apiKey: [this.grocyService.apiKey, Validators.required ]
  });

  private ngUnsubscribe = new ReplaySubject<true>();

  private forceCheck = new BehaviorSubject(true);

  constructor(
    private grocyService: GrocyService,
    private _fb: FormBuilder
  ) { }

  formControl(name: string) {
    return this.form.get(name);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
  }

  ngOnInit(): void {
    merge(
      this.form.valueChanges,
      this.forceCheck
    ).pipe(
      tap(() => this.updateValidationStatus()),
      takeUntil(this.ngUnsubscribe),
      debounceTime(250),
      filter(() =>  this.form.valid),
      tap(() => this.working = true),
      switchMap(_ => this.grocyService.getSystemInfo(
        this.formControl("url").value,
        this.formControl("apiKey").value
      ).pipe(
      map(r => ({result: "success" as "success", resp: r})),
      catchError((e: HttpErrorResponse) => of({result: "error" as "error", err: e}))
      )),
      tap(() => this.working = false)
    ).subscribe(r =>  this.renderReturn(r));

    if (this.form.valid) {
      this.forceCheck.next(true);
    }
  }

  updateValidationStatus() {
    this.configValid.emit(this.lastHttpResponseSuccess && this.form.valid);
  }

  renderReturn(resp: responseRender) {
    if (resp.result === "error") {
      this.grocyVersion = null;
      this.lastHttpError = resp.err;
      this.lastHttpResponseSuccess = false;
    } else {
      this.grocyVersion = resp.resp.grocy_version.Version;
      this.lastHttpError = null;
      this.lastHttpResponseSuccess = true;
    }

    this.updateValidationStatus();
  }

  openAPIKeyUrl() {
    openUrl(this.manageKeysUrl());
  }

  openHassHelp() {
    openUrl("https://pantryparty.app/docs/getting_started/configure-has.html");
  }

  apiKeyText() {
    return `Get API Keys at ${this.manageKeysUrl()}`;
  }

  manageKeysUrl() {
    return `${this.hostWithoutAPI()}/manageapikeys`;
  }

  hostWithoutAPI() {
    return this.formControl("url").value.replace(/\/api$/, "");
  }

  looksLikeHass() {
    return this.lastHttpError && this.lastHttpError.status === 200;
  }

  saveSettings() {
     this.grocyService.apiKey = this.formControl("apiKey").value;
     this.grocyService.apiHost = this.formControl("url").value;
  }
}
