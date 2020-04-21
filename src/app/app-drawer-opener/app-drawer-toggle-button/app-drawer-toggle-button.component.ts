import { Component, OnInit, HostBinding, HostListener } from "@angular/core";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";

@Component({
  selector: "[drawerToggle]",
  templateUrl: "./app-drawer-toggle-button.component.html",
  styleUrls: ["./app-drawer-toggle-button.component.css"]
})
export class AppDrawerToggleButtonComponent {

  @HostBinding("ios.position") get position() {
    return "right";
  }

  @HostBinding("class.fas") get faClass() {
    return true;
  }

  @HostBinding("icon") get icon() {
    return "font://\uf0c9";
  }

  constructor(
    private drawer: RadSideDrawerComponent
  ) { }

  @HostListener("tap")
  toggle() {
    this.drawer.sideDrawer.toggleDrawerState();
  }

}
