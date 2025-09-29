const Config = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
};
console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

export default Config;
