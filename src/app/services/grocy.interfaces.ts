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
}

export interface GrocyProductAPIReturn extends BaseGrocyProduct {
  barcode: string;
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
  barcodes: string[];
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
