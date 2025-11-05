"use client";

import React, { useState, useEffect } from "react";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { SidebarProvider } from "@/context/SidebarContext";

// Types pour les données d'historique
interface HistoryItem {
  id: string;
  date: string;
  time: string;
  customer: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  status: "completed" | "pending" | "cancelled";
}

// Données d'exemple pour l'historique
const mockHistoryData: HistoryItem[] = [
  {
    id: "VNT-001",
    date: "2024-01-15",
    time: "14:30",
    customer: "Client A",
    items: [
      { name: "Produit 1", quantity: 2, price: 25.0 },
      { name: "Produit 2", quantity: 1, price: 15.0 },
    ],
    total: 65.0,
    paymentMethod: "Carte",
    status: "completed",
  },
  {
    id: "VNT-002",
    date: "2024-01-15",
    time: "15:45",
    customer: "Client B",
    items: [
      { name: "Produit 3", quantity: 1, price: 30.0 },
      { name: "Produit 4", quantity: 3, price: 10.0 },
    ],
    total: 60.0,
    paymentMethod: "Espèces",
    status: "completed",
  },
  {
    id: "VNT-003",
    date: "2024-01-14",
    time: "11:20",
    customer: "Client C",
    items: [{ name: "Produit 5", quantity: 1, price: 45.0 }],
    total: 45.0,
    paymentMethod: "Carte",
    status: "pending",
  },
  {
    id: "VNT-004",
    date: "2024-01-14",
    time: "16:10",
    customer: "Client D",
    items: [
      { name: "Produit 6", quantity: 2, price: 20.0 },
      { name: "Produit 7", quantity: 1, price: 35.0 },
    ],
    total: 75.0,
    paymentMethod: "Virement",
    status: "cancelled",
  },
  {
    id: "VNT-005",
    date: "2024-01-13",
    time: "09:15",
    customer: "Client E",
    items: [{ name: "Produit 8", quantity: 4, price: 12.5 }],
    total: 50.0,
    paymentMethod: "Carte",
    status: "completed",
  },
];

const HistoryPage = () => {
  // Initialisation directe des données mockées
  const [historyData] = useState<HistoryItem[]>(mockHistoryData);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredData = historyData.filter((item) => {
    const statusMatch =
      selectedStatus === "all" ? true : item.status === selectedStatus;
    const searchMatch =
      searchTerm === ""
        ? true
        : item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.items.some((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()),
          );
    const dateMatch = selectedDate === "" ? true : item.date === selectedDate;
    return statusMatch && searchMatch && dateMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  const totalRevenue = filteredData
    .filter((item) => item.status === "completed")
    .reduce((sum, item) => sum + item.total, 0);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <LeftSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Historique des Ventes
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Consultez l&apos;historique complet de vos transactions
                </p>
              </div>

              {/* Statistiques rapides */}
              <div className="flex space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">
                    Total des ventes
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    {totalRevenue.toFixed(2)} €
                  </p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">
                    Transactions
                  </p>
                  <p className="text-lg font-bold text-green-900">
                    {filteredData.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Recherche */}
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Rechercher par ID, client ou produit..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtre par statut */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="completed">Terminé</option>
                <option value="pending">En attente</option>
                <option value="cancelled">Annulé</option>
              </select>

              {/* Filtre par date */}
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              {/* Bouton de reset */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                  setSelectedDate("");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Liste des transactions */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune transaction trouvée
                </h3>
                <p className="text-gray-600">
                  Aucune transaction ne correspond à vos critères de recherche.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
                  >
                    {/* En-tête de la transaction */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            #{item.id}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.customer} • {item.date} à {item.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {item.total.toFixed(2)} €
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Détails des produits */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Produits achetés :
                      </h4>
                      <div className="space-y-2">
                        {item.items.map((product, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-900">
                              {product.name} × {product.quantity}
                            </span>
                            <span className="font-medium text-gray-900">
                              {(product.price * product.quantity).toFixed(2)} €
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                      <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        Voir détails
                      </button>
                      <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition-colors">
                        Imprimer reçu
                      </button>
                      {item.status === "pending" && (
                        <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HistoryPage;
