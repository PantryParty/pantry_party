import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent {
    @ViewChild(RadSideDrawerComponent, { static: false }) drawerComponent: RadSideDrawerComponent;

    constructor(
      //  private _router: Router
    ) {}

    closeDrawer() {
      this.drawerComponent.sideDrawer.closeDrawer();
    }

    // ngOnInit(): void {
    //   this._router.events.subscribe(event => {
    //     if (
    //           !this.privacyService.showAds ||
    //           event instanceof NavigationStart
    //         ) {
    //             Admob.hideBanner();
    //         } else if (event instanceof NavigationEnd) {
    //             setTimeout(() => this.createBanner(), 1000);
    //         }
    //     });
    // }

}
