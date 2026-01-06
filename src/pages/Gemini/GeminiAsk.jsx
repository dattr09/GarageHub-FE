import React, { useState, useRef, useEffect } from "react";
import { askGemini } from "../../services/GeminiApi";
import { Bot, Send, Check, X, Sparkles } from "lucide-react";

const GeminiAsk = ({ onClose }) => {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const now = Date.now();
        const userMessage = { sender: "user", text: prompt, time: now, read: false };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);
        setPrompt("");

        try {
            const result = await askGemini(prompt);
            setMessages((prev) => {
                const updated = [...prev];
                for (let i = updated.length - 1; i >= 0; i--) {
                    if (updated[i].sender === "user" && !updated[i].read) {
                        updated[i] = { ...updated[i], read: true };
                        break;
                    }
                }
                return [...updated, { sender: "ai", text: result, time: Date.now() }];
            });
        } catch (error) {
            setMessages((prev) => [...prev, { sender: "ai", text: "Lỗi khi nhận phản hồi từ AI.", time: Date.now() }]);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div
            className="fixed bottom-6 right-6 w-[400px] h-[550px] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[1000] border border-gray-200"
            style={{ maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 100px)" }}
        >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold leading-tight">GarageHub AI</h3>
                        <p className="text-xs text-white/80">Trợ lý thông minh</p>
                    </div>
                </div>
                <button
                    aria-label="Đóng chat"
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-gray-100">
                {messages.length === 0 && (
                    <div className="text-center py-8">
                        <Bot className="w-16 h-16 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">Hãy hỏi tôi bất cứ điều gì về xe máy!</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isUser = msg.sender === "user";
                    return (
                        <div
                            key={index}
                            className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}
                        >
                            {!isUser && (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-2 flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                            )}
                            <div
                                className={`px-4 py-2.5 rounded-2xl max-w-[75%] break-words shadow-sm ${isUser
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                    : "bg-white text-gray-800 border border-gray-100"
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                                    <span>{formatTime(msg.time)}</span>
                                    {isUser && msg.read && (
                                        <Check className="w-3 h-3 text-green-300" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {loading && (
                    <div className="mb-3 flex justify-start">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-2">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form className="flex gap-3 p-3 bg-white border-t border-gray-100 items-center" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Nhập câu hỏi..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center disabled:opacity-50 hover:shadow-lg transition-all"
                    disabled={!prompt.trim() || loading}
                >
                    <Send className="w-5 h-5 text-white" />
                </button>
            </form>
        </div>
    );
};

export default GeminiAsk;