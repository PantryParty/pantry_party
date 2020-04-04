import { Component, OnInit, HostBinding } from "@angular/core";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";

@Component({
  selector: "[drawerToggle]",
  templateUrl: "./app-drawer-toggle-button.component.html",
  styleUrls: ["./app-drawer-toggle-button.component.css"]
})
export class AppDrawerToggleButtonComponent implements OnInit {

   @HostBinding("ios.position") get position() {
     return "right";
   }

   constructor(
    private drawer: RadSideDrawerComponent
  ) { }

   ngOnInit(): void {
  }

   toggle() {
    this.drawer.sideDrawer.toggleDrawerState();
  }

}
