import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AsyncValidator, FormControl } from "@angular/forms";

export class AsyncUniqeName {
  static createValidator(
    existingNames: Observable<string[]>,
    errorStr: string = "valueExists"
  ): AsyncValidator {
    return {
      validate: (control: FormControl) => {
        const value = control.value.toLowerCase();

        return existingNames.pipe(
          map(names => !!names.find(n => n.toLowerCase() === value)),
          map(found => found ? {[errorStr]: true} : null)
        );
      }
    };
  }
}
