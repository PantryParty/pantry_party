export interface StockFilters {
  showChildProducts: boolean;
  showOnlyBelowMinStock: boolean;
  withinDaysOfExpiration: string;
  includeOpenAsOutOfStock: boolean;
  onlyShowOutOfStock: boolean;
  belowMinQuantity: boolean;
}
