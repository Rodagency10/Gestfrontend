"use client";

import React, { useState } from "react";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { SidebarProvider } from "@/context/SidebarContext";

// Types pour les données du caissier
interface ShiftData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  cashier: string;
  transactions: number;
  totalSales: number;
  cashSales: number;
  cardSales: number;
  discounts: number;
  refunds: number;
  openingCash: number;
  closingCash: number;
  expectedCash: number;
  variance: number;
  status: "open" | "closed" | "pending";
}

interface TransactionSummary {
  paymentMethod: string;
  count: number;
  amount: number;
  percentage: number;
}

interface HourlySales {
  hour: string;
  transactions: number;
  amount: number;
}

// Données mockées pour les rapports caissier
const currentShift: ShiftData = {
  id: "SHIFT-2024-001",
  date: "2024-01-15",
  startTime: "08:00",
  endTime: "16:00",
  cashier: "Marie Dubois",
  transactions: 127,
  totalSales: 2845.5,
  cashSales: 1245.3,
  cardSales: 1600.2,
  discounts: 125.0,
  refunds: 89.5,
  openingCash: 200.0,
  closingCash: 1445.3,
  expectedCash: 1445.3,
  variance: 0.0,
  status: "open",
};

const previousShifts: ShiftData[] = [
  {
    id: "SHIFT-2024-002",
    date: "2024-01-14",
    startTime: "16:00",
    endTime: "00:00",
    cashier: "Pierre Martin",
    transactions: 98,
    totalSales: 2156.75,
    cashSales: 856.25,
    cardSales: 1300.5,
    discounts: 85.0,
    refunds: 45.0,
    openingCash: 200.0,
    closingCash: 1056.25,
    expectedCash: 1056.25,
    variance: 0.0,
    status: "closed",
  },
  {
    id: "SHIFT-2024-003",
    date: "2024-01-14",
    startTime: "08:00",
    endTime: "16:00",
    cashier: "Marie Dubois",
    transactions: 145,
    totalSales: 3245.8,
    cashSales: 1645.4,
    cardSales: 1600.4,
    discounts: 156.2,
    refunds: 123.75,
    openingCash: 200.0,
    closingCash: 1845.4,
    expectedCash: 1845.4,
    variance: 0.0,
    status: "closed",
  },
];

const paymentSummary: TransactionSummary[] = [
  { paymentMethod: "Espèces", count: 65, amount: 1245.3, percentage: 43.7 },
  {
    paymentMethod: "Carte bancaire",
    count: 52,
    amount: 1400.2,
    percentage: 49.2,
  },
  {
    paymentMethod: "Carte sans contact",
    count: 10,
    amount: 200.0,
    percentage: 7.1,
  },
];

const hourlySales: HourlySales[] = [
  { hour: "08:00", transactions: 8, amount: 185.5 },
  { hour: "09:00", transactions: 12, amount: 275.3 },
  { hour: "10:00", transactions: 15, amount: 345.8 },
  { hour: "11:00", transactions: 18, amount: 425.9 },
  { hour: "12:00", transactions: 22, amount: 545.75 },
  { hour: "13:00", transactions: 20, amount: 485.6 },
  { hour: "14:00", transactions: 16, amount: 375.4 },
  { hour: "15:00", transactions: 12, amount: 285.25 },
  { hour: "16:00", transactions: 4, amount: 120.0 },
];

const SalesReportsPage = () => {
  const [selectedView, setSelectedView] = useState<"current" | "history">(
    "current",
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const calculateCashBalance = () => {
    const expected =
      currentShift.openingCash + currentShift.cashSales - currentShift.refunds;
    return {
      expected,
      actual: currentShift.closingCash,
      variance: currentShift.closingCash - expected,
    };
  };

  const cashBalance = calculateCashBalance();

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
                  Rapports Caisse
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Gestion des shifts et rapports de caisse quotidiens
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedView("current")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedView === "current"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Shift Actuel
                </button>
                <button
                  onClick={() => setSelectedView("history")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedView === "history"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Historique
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedView === "current" ? (
              <>
                {/* Informations du shift actuel */}
                <div className="bg-white rounded-lg p-6 border mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Shift Actuel - {currentShift.id}
                      </h2>
                      <p className="text-gray-600">
                        {currentShift.cashier} • {currentShift.date} •{" "}
                        {currentShift.startTime} - {currentShift.endTime}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentShift.status === "open"
                          ? "bg-green-100 text-green-800"
                          : currentShift.status === "closed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {currentShift.status === "open"
                        ? "Ouvert"
                        : currentShift.status === "closed"
                          ? "Fermé"
                          : "En attente"}
                    </span>
                  </div>

                  {/* Métriques principales */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">
                        Transactions
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {currentShift.transactions}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">
                        Total Ventes
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {currentShift.totalSales.toFixed(2)} €
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-600 font-medium">
                        Remises
                      </p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {currentShift.discounts.toFixed(2)} €
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">
                        Remboursements
                      </p>
                      <p className="text-2xl font-bold text-red-900">
                        {currentShift.refunds.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>

                {/* Détail des paiements et caisse */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Répartition des paiements */}
                  <div className="bg-white rounded-lg p-6 border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Répartition des Paiements
                    </h3>
                    <div className="space-y-4">
                      {paymentSummary.map((payment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {payment.paymentMethod}
                            </p>
                            <p className="text-sm text-gray-600">
                              {payment.count} transactions
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {payment.amount.toFixed(2)} €
                            </p>
                            <p className="text-sm text-gray-600">
                              {payment.percentage}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gestion de caisse */}
                  <div className="bg-white rounded-lg p-6 border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Gestion de Caisse
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Fond de caisse ouverture:
                        </span>
                        <span className="font-medium">
                          {currentShift.openingCash.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ventes espèces:</span>
                        <span className="font-medium text-green-600">
                          +{currentShift.cashSales.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Remboursements espèces:
                        </span>
                        <span className="font-medium text-red-600">
                          -{currentShift.refunds.toFixed(2)} €
                        </span>
                      </div>
                      <hr className="my-3" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Espèces attendues:</span>
                        <span>{cashBalance.expected.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Espèces comptées:</span>
                        <span className="font-medium">
                          {cashBalance.actual.toFixed(2)} €
                        </span>
                      </div>
                      <div
                        className={`flex justify-between font-semibold ${
                          cashBalance.variance === 0
                            ? "text-green-600"
                            : cashBalance.variance > 0
                              ? "text-blue-600"
                              : "text-red-600"
                        }`}
                      >
                        <span>Écart:</span>
                        <span>
                          {cashBalance.variance > 0 ? "+" : ""}
                          {cashBalance.variance.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ventes par heure */}
                <div className="bg-white rounded-lg p-6 border mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ventes par Heure
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hourlySales.map((hour, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">
                            {hour.hour}
                          </span>
                          <span className="text-sm text-gray-600">
                            {hour.transactions} ventes
                          </span>
                        </div>
                        <p className="text-lg font-bold text-blue-600 mt-1">
                          {hour.amount.toFixed(2)} €
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Imprimer Rapport Z
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Clôturer Shift
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                      Rapport X (intermédiaire)
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Compter Caisse
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Vue Historique */
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Historique des Shifts
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Shift ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Caissier
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Horaires
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">
                          Transactions
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">
                          Total Ventes
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">
                          Écart Caisse
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">
                          Statut
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {previousShifts.map((shift) => (
                        <tr
                          key={shift.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {shift.id}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {shift.date}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {shift.cashier}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {shift.startTime} - {shift.endTime}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">
                            {shift.transactions}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                            {shift.totalSales.toFixed(2)} €
                          </td>
                          <td
                            className={`py-3 px-4 text-sm text-right font-medium ${
                              shift.variance === 0
                                ? "text-green-600"
                                : shift.variance > 0
                                  ? "text-blue-600"
                                  : "text-red-600"
                            }`}
                          >
                            {shift.variance > 0 ? "+" : ""}
                            {shift.variance.toFixed(2)} €
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                shift.status === "closed"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {shift.status === "closed"
                                ? "Fermé"
                                : "En attente"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Voir détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SalesReportsPage;
