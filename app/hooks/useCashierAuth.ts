import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook pour vérifier l'authentification du caissier.
 * Redirige vers /login si le caissier n'est pas authentifié.
 */
export default function useCashierAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("cashier_token");
      const cashierData = localStorage.getItem("cashier_data");

      if (token && cashierData) {
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        setIsAuthenticated(false);
        setLoading(false);
        // Redirige vers la page de login si non authentifié
        router.replace("/login");
      }
    }
  }, [router]);

  return { isAuthenticated, loading };
}
