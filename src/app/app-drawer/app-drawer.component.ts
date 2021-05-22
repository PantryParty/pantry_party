import { Component, EventEmitter, Output } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";

@Component({
  selector: "ns-app-drawer",
  templateUrl: "./app-drawer.component.html",
  styleUrls: ["./app-drawer.component.scss"]
})
export class AppDrawerComponent {
  @Output() navigatedAway = new EventEmitter<void>();

  constructor(
    private routerExtensions: RouterExtensions
  ) { }

  navigateTo(args: any) {
    this.navigatedAway.emit();
    this.routerExtensions.navigate(args, {clearHistory: true});
  }

}
