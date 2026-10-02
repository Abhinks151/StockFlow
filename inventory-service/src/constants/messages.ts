export const MESSAGES = {
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  STOCK_UPDATED: "Stock quantity updated successfully",
  PRODUCT_FETCHED: "Product fetched successfully",
  PRODUCTS_FETCHED: "Products fetched successfully",
  PRODUCT_NOT_FOUND: "Product not found",
  INVALID_PRODUCT_DATA: "Invalid product data provided",
  MISSING_REQUIRED_FIELDS: "Required fields (name, category, stock) are missing",
  INVALID_STOCK_VALUE: "Stock must be a non-negative integer",
  NAME_CANNOT_BE_EMPTY: "Product name cannot be empty",
  CATEGORY_CANNOT_BE_EMPTY: "Category cannot be empty",
  SERVER_ERROR: "Internal server error",
} as const;
