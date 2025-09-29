import axios from "axios";
import { toast } from "react-hot-toast";
import Config from "../envVars";

// Create axios instance with default config
const api = axios.create({
  baseURL: `${Config.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
