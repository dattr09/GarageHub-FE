import React, { useState, useRef, useEffect } from "react";
import { askGemini } from "../../services/GeminiApi";
import { FaRobot } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import { BsCheck2 } from "react-icons/bs";

const GeminiAsk = ({ onClose }) => {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]); // { sender, text, time, read }
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
                return [
                    ...updated,
                    { sender: "ai", text: result, time: Date.now() }
                ];
            });
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "Error fetching response from AI.", time: Date.now() }
            ]);
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
            className="fixed bottom-6 right-6 w-[380px] h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[1000] transition-all duration-300 transform-origin-bottom-right"
            style={{ maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 100px)" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shadow-sm">
                        <FaRobot className="text-2xl text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold leading-tight">GarageHub AI</h3>
                        <p className="text-xs opacity-90">Hỗ trợ trực tuyến • AI trả lời nhanh</p>
                    </div>
                </div>
                <button
                    aria-label="Đóng chat"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
                >
                    ✕
                </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-white/60 to-gray-50 backdrop-blur-sm">
                {messages.map((msg, index) => {
                    const isUser = msg.sender === "user";
                    return (
                        <div
                            key={index}
                            className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"} transition-transform duration-150`}
                        >
                            <div
                                className={`px-3 py-2 rounded-2xl max-w-[75%] break-words shadow-sm transform transition-all duration-150 ${isUser
                                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:scale-[1.01]"
                                        : "bg-white text-gray-800 border border-gray-100 hover:scale-[1.01]"
                                    }`}
                            >
                                <p className="text-sm mb-0.5 leading-relaxed">{msg.text}</p>
                                <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                                    <span>{formatTime(msg.time)}</span>
                                    {isUser && msg.read && (
                                        <BsCheck2 className="inline text-lg text-green-300" title="Đã đọc" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {loading && (
                    <div className="mb-3 flex justify-start">
                        <div className="bg-white px-2 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.12s" }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.24s" }} />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <form className="flex gap-3 p-3 bg-white border-t border-gray-200 items-center" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:opacity-70"
                />

                <button
                    type="submit"
                    className="group w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center disabled:opacity-50 transform transition hover:scale-105 active:scale-95"
                    disabled={!prompt.trim() || loading}
                >
                    <AiOutlineSend className="text-white w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default GeminiAsk;