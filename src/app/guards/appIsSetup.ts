import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { getBoolean } from "@nativescript/core/application-settings";

@Injectable()
export class ApplicationIsSetup implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ) {
    if (getBoolean("app.setupComplete", false)) {
      return true;
    } else {
      this.router.navigate(["/initialSetup"]);

      return false;
    }
  }
}
