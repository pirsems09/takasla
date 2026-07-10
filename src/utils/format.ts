import type { Product } from "@api/types";

/**
 * Formats a product's price into a human-readable label.
 *
 * - When `priceMin` and `priceMax` are both present → "1000-3000 TL"
 * - Otherwise falls back to "{currency}{price}" → "$14"
 */
export const formatPrice = (product: Product): string => {
  if (product.priceMin && product.priceMax) {
    return `${product.priceMin}-${product.priceMax} TL`;
  }

  return `${product.currency}${product.price}`;
};

/**
 * Parses a product's price into a numeric value for sorting / comparison.
 * Prefers `priceMin`, then falls back to `price`.
 */
export const parsePrice = (product: Product): number => {
  const value = product.priceMin ?? product.price ?? "0";
  return Number(value);
};
