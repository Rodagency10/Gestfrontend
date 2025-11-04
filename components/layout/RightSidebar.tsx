"use client";

import React, { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const RightSidebar = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: "Chicken Dimsum", price: 15.99, quantity: 1 },
    { id: 2, name: "Matcha Latte", price: 10.99, quantity: 2 },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const { isRightSidebarOpen, toggleRightSidebar } = useSidebar();

  return (
    <div
      className={`${isRightSidebarOpen ? "w-80" : "w-20"} h-screen bg-white border-l flex flex-col transition-all duration-300`}
    >
      {/* En-tête */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h2
            className={`font-semibold text-lg ${!isRightSidebarOpen && "hidden"}`}
          >
            Table 5
          </h2>
          {isRightSidebarOpen ? (
            <button className="text-blue-600 text-sm hover:text-blue-700">
              Download Receipt
            </button>
          ) : (
            <button
              onClick={toggleRightSidebar}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              ←
            </button>
          )}
        </div>
        <div
          className={`flex space-x-2 text-sm text-gray-600 ${!isRightSidebarOpen && "hidden"}`}
        >
          <span>Order #123</span>
          <span>•</span>
          <span>Dine In</span>
        </div>
        {isRightSidebarOpen || (
          <button
            onClick={toggleRightSidebar}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            →
          </button>
        )}
      </div>

      {/* Liste des articles */}
      <div
        className={`flex-1 overflow-y-auto p-4 ${!isRightSidebarOpen && "hidden"}`}
      >
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <span className="text-gray-600">${item.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total et validation */}
      <div
        className={`p-4 border-t bg-gray-50 ${!isRightSidebarOpen && "hidden"}`}
      >
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-black">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black">
            <span>Tax (10%)</span>
            <span>${(total * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black text-lg font-semibold">
            <span>Total</span>
            <span>${(total * 1.1).toFixed(2)}</span>
          </div>
        </div>
        <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
