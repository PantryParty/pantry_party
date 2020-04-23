import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { ProductSelectorComponent } from "./product-selector.component";

@NgModule({
  declarations: [ProductSelectorComponent],
  exports: [ ProductSelectorComponent ],
  entryComponents: [ ProductSelectorComponent ],
  imports: [ NativeScriptCommonModule ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProductModalModule { }
