import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NativeScriptHttpClientModule, NativeScriptFormsModule } from "nativescript-angular";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { AppDrawerComponent } from "./app-drawer/app-drawer.component";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptUISideDrawerModule,
        NativeScriptHttpClientModule,
        NativeScriptAnimationsModule,
        ReactiveFormsModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AppComponent,
        AppDrawerComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
