import api from "./api";

export const askGemini = async (prompt) => {
    try {
        const response = await api.post("/gemini/ask", { prompt });
        return response.data.result;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};