import { useState, useEffect, useCallback } from "react";

// Types pour les données du dashboard
interface DashboardStats {
  totalSales: {
    value: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
  totalProducts: {
    value: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
  totalUsers: {
    value: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
}

interface RecentActivity {
  id: string;
  type: "sale" | "purchase" | "user" | "restock";
  description: string;
  amount?: number;
  time: string;
  category: string;
}

interface LowStockProduct {
  product_id: string;
  name: string;
  stock: number;
  category: string;
  min_stock: number;
}

interface TopProduct {
  product_id: string;
  name: string;
  sales: number;
  revenue: number;
  category: string;
}

interface SalesData {
  sale_id: string;
  total_amount: string;
  date: string;
  username: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: string;
    total_price: string;
  }[];
}

interface ProductData {
  product_id: string;
  name: string;
  quantity: number;
  category_id: string;
  sale_price: string;
}

const useAdminDashboard = (timeFilter: string = "today") => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: { value: 0, change: 0, trend: "stable" },
    totalProducts: { value: 0, change: 0, trend: "stable" },
    totalUsers: { value: 0, change: 0, trend: "stable" },
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>(
    [],
  );
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7000";

  // Fonction utilitaire pour les requêtes API
  const makeRequest = useCallback(
    async (url: string) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token")
          : null;

      const response = await fetch(`${baseUrl}${url}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return response.json();
    },
    [baseUrl],
  );

  // Calculer les dates pour les filtres
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    switch (timeFilter) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(startDate.getDate() - 1);
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(startDate.getDate() - 1);
    }

    return { startDate, previousStartDate, endDate: now };
  }, [timeFilter]);

  // Récupérer les statistiques de vente
  const fetchSalesStats = useCallback(async () => {
    try {
      const { startDate, previousStartDate, endDate } = getDateRange();

      // Récupérer les ventes actuelles
      const currentSales = await makeRequest("/admin/sales/all");
      const currentSalesFiltered =
        currentSales.sales?.filter((sale: SalesData) => {
          const saleDate = new Date(sale.date);
          return saleDate >= startDate && saleDate <= endDate;
        }) || [];

      // Récupérer les ventes de la période précédente pour calculer le changement
      const previousSales = await makeRequest("/admin/sales/all");
      const previousSalesFiltered =
        previousSales.sales?.filter((sale: SalesData) => {
          const saleDate = new Date(sale.date);
          return saleDate >= previousStartDate && saleDate < startDate;
        }) || [];

      const currentTotal = currentSalesFiltered.reduce(
        (sum: number, sale: SalesData) => sum + Number(sale.total_amount),
        0,
      );
      const previousTotal = previousSalesFiltered.reduce(
        (sum: number, sale: SalesData) => sum + Number(sale.total_amount),
        0,
      );

      const change =
        previousTotal > 0
          ? ((currentTotal - previousTotal) / previousTotal) * 100
          : 0;
      const trend: "up" | "down" | "stable" =
        change > 0 ? "up" : change < 0 ? "down" : "stable";

      return {
        value: currentTotal,
        change: Math.abs(change),
        trend,
        salesData: currentSalesFiltered,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes:", error);
      return { value: 0, change: 0, trend: "stable" as const, salesData: [] };
    }
  }, [makeRequest, getDateRange]);

  // Récupérer les statistiques des produits
  const fetchProductStats = useCallback(async () => {
    try {
      const products = await makeRequest("/admin/products");
      const productList = products.products || [];

      const totalProducts = productList.length;
      const lowStock = productList.filter(
        (product: ProductData) => product.quantity < 10,
      );

      return {
        totalProducts,
        lowStockProducts: lowStock.slice(0, 5).map((product: ProductData) => ({
          product_id: product.product_id,
          name: product.name,
          stock: product.quantity,
          category: "Général", // À adapter selon votre structure
          min_stock: 10,
        })),
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      return { totalProducts: 0, lowStockProducts: [] };
    }
  }, [makeRequest]);

  // Récupérer les statistiques des caissiers
  const fetchUserStats = useCallback(async () => {
    try {
      const cashiers = await makeRequest("/cashiers/");
      return cashiers.cashiers?.length || 0;
    } catch (error) {
      console.error("Erreur lors de la récupération des caissiers:", error);
      return 0;
    }
  }, [makeRequest]);

  // Calculer les produits les plus vendus
  const calculateTopProducts = useCallback(
    async (salesData: SalesData[]) => {
      const productSales: {
        [key: string]: { quantity: number; revenue: number; name: string };
      } = {};

      // Récupérer la liste des produits pour le mapping ID -> nom
      let products: ProductData[] = [];
      try {
        const productsResponse = await makeRequest("/admin/products");
        products = productsResponse.products || [];
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }

      salesData.forEach((sale) => {
        sale.items.forEach((item) => {
          const productId = item.product_id;
          if (!productSales[productId]) {
            // Trouver le nom du produit
            const product = products.find((p) => p.product_id === productId);
            const productName = product
              ? product.name
              : item.product_id.slice(0, 15);

            productSales[productId] = {
              quantity: 0,
              revenue: 0,
              name: productName,
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += Number(item.total_price);
        });
      });

      return Object.entries(productSales)
        .map(([productId, data]) => ({
          product_id: productId,
          name: data.name,
          sales: data.quantity,
          revenue: data.revenue,
          category: "Général",
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
    },
    [makeRequest],
  );

  // Générer les activités récentes
  const generateRecentActivities = useCallback((salesData: SalesData[]) => {
    const activities: RecentActivity[] = [];

    // Ajouter les ventes récentes
    salesData.slice(0, 10).forEach((sale) => {
      const timeAgo = Math.floor(
        (Date.now() - new Date(sale.date).getTime()) / (1000 * 60),
      );
      let timeText = "";

      if (timeAgo < 60) {
        timeText = `Il y a ${timeAgo} min`;
      } else if (timeAgo < 1440) {
        timeText = `Il y a ${Math.floor(timeAgo / 60)}h`;
      } else {
        timeText = `Il y a ${Math.floor(timeAgo / 1440)} jour(s)`;
      }

      activities.push({
        id: sale.sale_id,
        type: "sale",
        description: `Vente par ${sale.username}`,
        amount: Number(sale.total_amount),
        time: timeText,
        category: "Vente",
      });
    });

    return activities.sort((a, b) => b.id.localeCompare(a.id));
  }, []);

  // Fonction principale pour charger toutes les données
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer toutes les données en parallèle
      const [salesStats, productStats, userCount] = await Promise.all([
        fetchSalesStats(),
        fetchProductStats(),
        fetchUserStats(),
      ]);

      // Calculer les produits les plus vendus
      const topProductsData = await calculateTopProducts(salesStats.salesData);

      // Générer les activités récentes
      const activities = generateRecentActivities(salesStats.salesData);

      // Mettre à jour les états
      setStats({
        totalSales: {
          value: salesStats.value,
          change: salesStats.change,
          trend: salesStats.trend,
        },
        totalProducts: {
          value: productStats.totalProducts,
          change: 0, // À implémenter si nécessaire
          trend: "stable",
        },
        totalUsers: {
          value: userCount,
          change: 0, // À implémenter si nécessaire
          trend: "stable",
        },
      });

      setTopProducts(topProductsData);
      setLowStockProducts(productStats.lowStockProducts);
      setRecentActivities(activities);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [
    fetchSalesStats,
    fetchProductStats,
    fetchUserStats,
    calculateTopProducts,
    generateRecentActivities,
  ]);

  // Charger les données au montage et quand le filtre change
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    recentActivities,
    lowStockProducts,
    topProducts,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};

export default useAdminDashboard;
