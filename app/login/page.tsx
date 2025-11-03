"use client";

import React, { useState } from "react";
import Input from "@/components/ui/form/Input";
import PasswordInput from "@/components/ui/form/PasswordInput";
import Button from "@/components/ui/form/Button";
import Image from "next/image";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would make the actual API call to authenticate
      console.log("Login attempt:", formData);

      // For now, just simulate success/failure
      if (formData.username === "admin" && formData.password === "password") {
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Illustration */}
          <div className="lg:w-1/2 bg-blue-600 p-8 flex flex-col justify-center items-center text-white relative rounded-tl-2xl rounded-bl-2xl">
            <div className="text-center ">
              <h1 className="text-5xl font-bold mb-2">Bienvenue</h1>
              <p className="text-xl text-blue-100">
                Système de Gestion de Stock
              </p>
              <p className="mt-2 text-base text-blue-100 opacity-90">
                Gérez vos ventes et vos stocks simplement, rapidement et en
                toute sécurité.
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <Image
                src="/cashier.jpg"
                alt="Caissière"
                width={500}
                height={300}
                className="filter drop-shadow-lg object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-md mx-auto space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Connexion Caissier
                </h2>
                <p className="text-gray-600">
                  Entrez vos identifiants pour accéder au système
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  name="username"
                  type="text"
                  label="Nom d'utilisateur"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  size="lg"
                  leftIcon={
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  }
                />

                <PasswordInput
                  name="password"
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  size="lg"
                  leftIcon={
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  }
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex">
                      <svg
                        className="w-5 h-5 text-red-400 mt-0.5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  leftIcon={
                    !loading ? (
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
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                    ) : null
                  }
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Problème de connexion ?{" "}
                  <button className="text-blue-600 hover:text-blue-500 font-medium">
                    Contactez l&apos;administrateur
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
