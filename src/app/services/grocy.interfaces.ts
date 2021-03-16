export interface GrocyProductBarcode {
    id: string;
    product_id: string;
    barcode: string;
    qu_id: string | null;
    amount: string;
    shopping_location_id: string
}

export interface GrocyLocation {
  id: string;
  name: string;
  description: string | null;
  is_freezer: "1" | "0";
}

export interface GrocyItemCreated {
  created_object_id: string;
}

export interface GrocyQuantityUnit {
  id: string;
  name: string;
  description: string | null;
  row_created_timestamp: string;
  name_plural: string;
  plural_forms: string | null;
}

interface BaseGrocyProduct {
  id: string;
  name: string;
  description: string;
  parent_product_id: null | string;
}

export interface GrocyProductAPIReturn extends BaseGrocyProduct {
  min_stock_amount: string;
  qu_id_purchase: string;
  qu_id_stock: string;
  qu_factor_purchase_to_stock: string;
  location_id: string;
  default_best_before_days: string;
  default_best_before_days_after_open: string;
  default_best_before_days_after_freezing: string;
  default_best_before_days_after_thawing: string;
}

export interface GrocyProduct extends BaseGrocyProduct {
  min_stock_amount: number;
  quantity_unit_id_purchase: number;
  quantity_unit_id_stock: number;
  quantity_unit_factor_purchase_to_stock: number;
  location_id: number;
  default_best_before_days: number;
  default_best_before_days_after_open: number;
  default_best_before_days_after_freezing: number;
  default_best_before_days_after_thawing: number;
}

export interface GrocyStockAPIReturn {
  product_id: number;
  amount: number;
  amount_aggregated: number;
  amount_opened: number;
  amount_opened_aggregated: number;
  best_before_date: string;
  is_aggregated_amount: true;
  product: GrocyProductAPIReturn;
}

export interface GrocyStockEntry {
  is_in_stock: boolean;
  product_id: number;
  amount: number;
  amount_aggregated: number;
  amount_opened: number;
  amount_opened_aggregated: number;
  best_before_date: Date;
  is_aggregated_amount: boolean;
  product: GrocyProduct;
}

export interface GrocyVolatileReturn {
  missing_products: {
    id: string;
    name: string;
    amount_missing: string;
    is_partly_in_stock: "0" | "1";
  }[];
}
