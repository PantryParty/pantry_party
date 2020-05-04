import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import * as Admob from "nativescript-admob";
import { Router, NavigationStart, NavigationEnd, RouterEvent } from "@angular/router";
import { getBoolean } from "tns-core-modules/application-settings/application-settings";
import { PrivacyService } from "./services/privacy.service";
import { Frame } from "tns-core-modules/ui/frame/frame";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { envConfig } from "./utilities/env";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    @ViewChild(RadSideDrawerComponent, { static: false }) drawerComponent: RadSideDrawerComponent;

    private testing = envConfig.adTesting;
    private androidBannerId: string = "ca-app-pub-7265627701189310/9591754412";
    private iosBannerId: string = "ca-app-pub-7265627701189310/7896363511";

    constructor(
      private _router: Router,
      private privacyService: PrivacyService
    ) {}

    closeDrawer() {
      this.drawerComponent.sideDrawer.closeDrawer();
    }

    ngOnInit(): void {
      this._router.events.subscribe(event => {
        if (
              !this.privacyService.showAds ||
              event instanceof NavigationStart
            ) {
                Admob.hideBanner();
            } else if (event instanceof NavigationEnd) {
                setTimeout(() => this.createBanner(), 1000);
            }
        });
    }

    createBanner() {
      Admob.createBanner({
        testing: this.testing,
        size: Admob.AD_SIZE.SMART_BANNER,
        iosBannerId: this.iosBannerId,
        androidBannerId: this.androidBannerId,
        margins: {
          bottom: 0
        }
      }).then(() =>  console.log("admob createBanner donex"))
      .catch(error =>  console.log("admob createBanner error: " + error));
    }
}
