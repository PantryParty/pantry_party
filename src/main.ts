// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app/app.module";
import { enableProdMode } from "@angular/core";
import { envConfig } from "./app/utilities/env";

if (envConfig.enableNgProdMode) {
  enableProdMode();
}
platformNativeScriptDynamic().bootstrapModule(AppModule);
