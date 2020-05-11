import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent {
    @ViewChild(RadSideDrawerComponent, { static: false }) drawerComponent: RadSideDrawerComponent;

    closeDrawer() {
      this.drawerComponent.sideDrawer.closeDrawer();
    }

}
