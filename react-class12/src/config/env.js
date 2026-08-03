const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
  isDev: import.meta.env.DEV, // true en desarrollo, false en producción
  isProd: import.meta.env.PROD, // true en producción
  mode: import.meta.env.MODE, // "development" o "production"
};

// Verificar que las variables requeridas existen
if (!config.apiUrl) {
  throw new Error(
    "VITE_API_URL no está definida. " +
      "Crea un archivo .env. o .env.development con esta variable.",
  );
}

export default config;
