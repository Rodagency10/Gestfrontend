import { useState } from "react";

export interface Cashier {
  cashier_id: string;
  username: string;
  created_at: string;
  is_active: boolean;
}

export interface CashierSession {
  session_id: string;
  cashier_id: string;
  login_time: string;
  ip_address?: string;
  device_info?: string;
  is_active: boolean;
}

interface CashiersResponse {
  cashiers: Cashier[];
}

interface CashierResponse {
  cashier: Cashier;
}

interface SessionsResponse {
  sessions: CashierSession[];
}

interface LoginResponse {
  token: string;
  cashier: Cashier;
  session: CashierSession;
}

interface UseCashiersResult {
  cashiers: Cashier[];
  sessions: CashierSession[];
  cashier: Cashier | null;
  loading: boolean;
  error: string | null;
  getCashiers: () => Promise<void>;
  createCashier: (username: string, password: string) => Promise<void>;
  enableCashier: (cashierId: string) => Promise<void>;
  disableCashier: (cashierId: string) => Promise<void>;
  getCashierSessions: (cashierId: string) => Promise<void>;
  getAllSessions: () => Promise<void>;
  loginCashier: (username: string, password: string) => Promise<LoginResponse | null>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7000";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

const useCashiers = (): UseCashiersResult => {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [sessions, setSessions] = useState<CashierSession[]>([]);
  const [cashier, setCashier] = useState<Cashier | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Lister tous les caissiers
  const getCashiers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/cashiers/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      const data: CashiersResponse = await res.json();
      setCashiers(data.cashiers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération des caissiers");
    } finally {
      setLoading(false);
    }
  };

  // 2. Créer un caissier
  const createCashier = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/cashiers/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      const data: CashierResponse = await res.json();
      setCashier(data.cashier);
      await getCashiers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du caissier");
    } finally {
      setLoading(false);
    }
  };

  // 3. Désactiver un caissier
  const disableCashier = async (cashierId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/cashiers/${cashierId}/disable`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      await getCashiers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la désactivation du caissier");
    } finally {
      setLoading(false);
    }
  };

  // 4. Activer un caissier
  const enableCashier = async (cashierId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/cashiers/${cashierId}/enable`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      await getCashiers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'activation du caissier");
    } finally {
      setLoading(false);
    }
  };

  // 5. Lister les sessions d’un caissier
  const getCashierSessions = async (cashierId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/cashiers/${cashierId}/sessions`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      const data: SessionsResponse = await res.json();
      setSessions(data.sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération des sessions du caissier");
    } finally {
      setLoading(false);
    }
  };

  // 6. Lister toutes les sessions
  const getAllSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/cashiers/sessions`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      const data: SessionsResponse = await res.json();
      setSessions(data.sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération des sessions");
    } finally {
      setLoading(false);
    }
  };

  // 7. Connexion d’un caissier
  const loginCashier = async (username: string, password: string): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/cashiers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      const data: LoginResponse = await res.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la connexion du caissier");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    cashiers,
    sessions,
    cashier,
    loading,
    error,
    getCashiers,
    createCashier,
    enableCashier,
    disableCashier,
    getCashierSessions,
    getAllSessions,
    loginCashier,
  };
};

export default useCashiers;
