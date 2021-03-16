import { Component, ViewChild } from "@angular/core";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";

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
