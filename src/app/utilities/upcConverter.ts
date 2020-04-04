function transposeForUpcA(str: string, transpositions: [number, number][]) {
  let newString = "000000000000";
  transpositions.forEach((transposition) => {
    newString = newString.substr(0, transposition[1]) +
      str.substr(transposition[0], 1) +
      newString.substr(transposition[1] + 1);
  });

  return newString;
}

export function convertToUpcAIfRequired(upc: string): string {
  if (upc.length > 8) {
    return upc;
  } else {
    return upcEtoAConverter(upc);
  }
}

export function upcEtoAConverter(upc: string): string {
  return transposeForUpcA(upc, upcTransposes(upc));
}

function upcTransposes(upc: string): [number, number][] {
  switch (upc[6]) {
    case "0":
    case "1":
    case "2":
        return [ [0, 0], [1, 1], [2, 2], [3, 8], [4, 9], [5, 10], [6, 3], [7, 11] ];
    case "3":
        return [ [0, 0], [1, 1], [2, 2], [3, 3], [4, 9], [5, 10], [7, 11] ];
    case "4":
        return [ [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 10], [7, 11] ];
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
        return [ [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 10], [7, 11] ];
  }

  return [];
}
