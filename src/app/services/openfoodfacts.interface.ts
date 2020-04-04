export interface ProductFailure {
  status: 0;
  status_verbose: "product not found";
}

export interface ProductFound {
  status: 1;
  status_verbose: "product found";
  product: {
    brands: string;
    product_name: string;
  };
}

export type OpenFoodFactsProductResponse =
    ProductFailure
  | ProductFound;
