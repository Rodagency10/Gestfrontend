"use client";

import React from "react";

/**
 * Ce composant affiche dans la console navigateur toutes les variables d'environnement
 * Next.js accessibles côté client (NEXT_PUBLIC_*) au moment du rendu.
 *
 * Place-le dans une page ou importe-le temporairement pour vérifier ton setup.
 */
const EnvTestLog: React.FC = () => {
  // Liste toutes les variables d'env accessibles côté client
  const envVars = Object.entries(process.env)
    .filter(([key]) => key.startsWith("NEXT_PUBLIC_"))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string | undefined>);

  // Log dans la console navigateur
  React.useEffect(() => {
    // Affiche toutes les variables NEXT_PUBLIC_*
    console.log("=== ENV VARIABLES (NEXT_PUBLIC_*) ===");
    console.table(envVars);
    // Affiche aussi une variable précise si besoin
    console.log("NEXT_PUBLIC_BACKEND_URL =", process.env.NEXT_PUBLIC_BACKEND_URL);
  }, []);

  return (
    <div style={{ padding: 24, background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 8 }}>
      <h2 style={{ color: "#ad8b00" }}>Test des variables d&apos;environnement Next.js</h2>
      <p>
        Ouvre la console de ton navigateur pour voir toutes les variables <code>NEXT_PUBLIC_*</code> chargées.<br />
        <strong>Attention :</strong> Si tu modifies le fichier <code>.env</code>, redémarre le serveur Next.js !
      </p>
      <pre style={{ background: "#f6ffed", color: "#389e0d", padding: 12, borderRadius: 4 }}>
        {JSON.stringify(envVars, null, 2)}
      </pre>
    </div>
  );
};

export default EnvTestLog;
