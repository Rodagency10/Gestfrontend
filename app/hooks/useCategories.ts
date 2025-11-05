import { useState } from "react";

interface Category {
  category_id: string;
  name: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CategoriesResponse {
  categories: Category[];
}

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: (onlyActive?: boolean) => Promise<void>;
  addCategory: (name: string, type: string) => Promise<void>;
  updateCategory: (categoryId: string, name: string, type: string) => Promise<void>;
  enableCategory: (categoryId: string) => Promise<void>;
  disableCategory: (categoryId: string) => Promise<void>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7000";

export default function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const fetchCategories = async (onlyActive: boolean = false): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/admin/categories?onlyActive=${onlyActive}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: CategoriesResponse = await response.json();
      setCategories(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération des catégories");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string, type: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/categories`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, type }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Recharger les catégories après ajout
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryId: string, name: string, type: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/categories/${categoryId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, type }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Recharger les catégories après modification
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la modification de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  const enableCategory = async (categoryId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/categories/${categoryId}/enable`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Mettre à jour localement la catégorie
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.category_id === categoryId
            ? { ...category, is_active: true, updated_at: new Date().toISOString() }
            : category
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'activation de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  const disableCategory = async (categoryId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/categories/${categoryId}/disable`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Mettre à jour localement la catégorie
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.category_id === categoryId
            ? { ...category, is_active: false, updated_at: new Date().toISOString() }
            : category
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la désactivation de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    enableCategory,
    disableCategory,
  };
}
