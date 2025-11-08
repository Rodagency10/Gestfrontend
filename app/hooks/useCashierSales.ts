import { useEffect, useState } from "react";

export interface SaleItem {
  sale_item_id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Sale {
  sale_id: string;
  receipt_number: string;
  cashier_id: string;
  username: string;
  date: string;
  total_amount: string;
  items: SaleItem[];
}

interface SalesResponse {
  sales: Sale[];
}

export default function useCashierSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("cashier_token")
          : null;
      if (!token) {
        setError("Token caissier manquant");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7000"}/sales`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) {
          setError("Erreur lors de la récupération des ventes");
          setSales([]);
        } else {
          const data: SalesResponse = await res.json();
          setSales(data.sales || []);
        }
      } catch (e) {
        setError("Impossible de charger l'historique des ventes");
        setSales([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return { sales, loading, error };
}
