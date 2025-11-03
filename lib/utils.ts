export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(
  amount: number,
  currency: string = "XOF",
): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  format: "short" | "long" = "short",
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "long") {
    return dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return dateObj.toLocaleDateString("fr-FR");
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function generateReceiptId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `REC-${timestamp}-${random}`.toUpperCase();
}

export function calculateTotalPrice(
  items: Array<{ quantity: number; price: number }>,
): number {
  return items.reduce((total, item) => total + item.quantity * item.price, 0);
}

export function isLowStock(
  currentStock: number,
  minStock: number = 10,
): boolean {
  return currentStock <= minStock;
}

export function getStockStatus(
  currentStock: number,
  minStock: number = 10,
): "high" | "medium" | "low" | "out" {
  if (currentStock === 0) return "out";
  if (currentStock <= minStock) return "low";
  if (currentStock <= minStock * 2) return "medium";
  return "high";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
