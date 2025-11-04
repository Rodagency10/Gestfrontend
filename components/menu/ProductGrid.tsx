"use client";

import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

const categories = [
  { id: "all", label: "All Menu", icon: "🍽️" },
  { id: "main", label: "Main Course", icon: "🍖" },
  { id: "dessert", label: "Dessert", icon: "🍰" },
  { id: "drinks", label: "Drinks", icon: "🥤" },
  { id: "asian", label: "Asian", icon: "🍜" },
  { id: "western", label: "Western", icon: "🍔" },
];

const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Chicken Dimsum",
    category: "asian",
    price: 15.99,
    image: "/dishes/dimsum.jpg",
  },
  {
    id: 2,
    name: "Matcha Latte",
    category: "drinks",
    price: 10.99,
    image: "/dishes/matcha.jpg",
  },
  // Ajouter plus de produits ici
];

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? dummyProducts
      : dummyProducts.filter(
          (product) => product.category === selectedCategory,
        );

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50 p-6">
      {/* Header avec barre de recherche */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-64 pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Catégories */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-colors whitespace-nowrap
              ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
          >
            <span className="mr-2">{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gray-200">
              {/* Remplacer par une vraie image */}
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                Product Image
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  aria-label="Add to cart"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
