"use client";

import React from "react";
import EnvTestLog from "../env-test-log";

/**
 * Page dédiée pour tester le chargement des variables d'environnement Next.js côté client.
 * Accès : /env-test
 */
const EnvTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <EnvTestLog />
    </div>
  );
};

export default EnvTestPage;
