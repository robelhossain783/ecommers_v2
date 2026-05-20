export function formatPrice(price: number): string {
  return "৳ " + price.toLocaleString("en-BD");
}

export function getDiscount(regular: number, sale: number): number {
  return regular - sale;
}
