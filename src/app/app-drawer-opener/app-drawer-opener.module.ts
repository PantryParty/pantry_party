import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { AppDrawerToggleButtonComponent } from "./app-drawer-toggle-button/app-drawer-toggle-button.component";

@NgModule({
  declarations: [
    AppDrawerToggleButtonComponent
  ],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [AppDrawerToggleButtonComponent]
})
export class AppDrawerOpenerModule { }
