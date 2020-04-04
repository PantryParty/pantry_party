  export function arrayMove<T>(arr: T[], oldIndex: number, newIndex: number): T[] {
    arr = [...arr];

    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

    return arr;
  }
