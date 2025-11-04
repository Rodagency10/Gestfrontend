"use client";

import React from "react";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import ProductGrid from "@/components/menu/ProductGrid";
import { SidebarProvider } from "@/context/SidebarContext";

const DashboardPage = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar Gauche - Navigation */}
        <LeftSidebar />

        {/* Zone Centrale - Grille de Produits */}
        <ProductGrid />

        {/* Sidebar Droite - Panier */}
        <RightSidebar />
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;
