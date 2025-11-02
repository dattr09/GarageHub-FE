import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChatWidget = ({ userId, userToken }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const conversationId = userId; // User's conversation ID

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const isAdminUser =
          (Array.isArray(user.roles) && (user.roles.includes("admin") || user.roles.includes("ADMIN"))) ||
          user.role === "admin" ||
          user.role === "ADMIN" ||
          user.isAdmin === true;
        if (isAdminUser) setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId || isAdmin) return;

    const newSocket = io(`${SOCKET_URL}/chat`, {
      query: { userId, isAdmin: "false" },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      loadChatHistory();
    });

    newSocket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.senderRole === "admin" && !isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    newSocket.on("user-typing", ({ isTyping: typing, userRole }) => {
      if (userRole === "admin") setIsTyping(typing);
    });

    newSocket.on("messages-read", () => {
      setMessages((prev) =>
        prev.map((msg) => (msg.senderRole === "user" ? { ...msg, isRead: true } : msg))
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId, isAdmin]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/v1/chat/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      if (data.success) setMessages(data.messages);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      conversationId,
      message: newMessage.trim(),
      attachments: [],
    };

    socket.emit("send-message", messageData);
    setNewMessage("");
    socket.emit("typing", { conversationId, isTyping: false });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    socket.emit("typing", { conversationId, isTyping: true });

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { conversationId, isTyping: false });
    }, 1000);
  };

  const handleOpen = () => {
    if (isAdmin) {
      navigate("/admin/chat");
      return;
    }
    setIsOpen(true);
    setUnreadCount(0);
    if (socket) socket.emit("mark-as-read", { conversationId });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {!isOpen && (
        <button
          aria-label="Open chat"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center transition-transform duration-200 hover:scale-105 z-[1000] group"
        >
          {/* small SVG logo inside button */}
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-7 h-7 text-white">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="30" fill="url(#g1)" opacity="0.95" />
              <g fill="#fff">
                <path d="M20 42c0-7.732 6.268-14 14-14s14 6.268 14 14H20z" opacity="0.95" />
                <rect x="16" y="18" width="32" height="10" rx="2" opacity="0.95" />
              </g>
            </svg>
          </div>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-[380px] h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[1000] transition-all duration-300 transform-origin-bottom-right"
          style={{ maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 100px)" }}
        >
          {/* Header with logo (slightly shorter) */}
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shadow-sm">
                {/* inline logo */}
                <svg viewBox="0 0 64 64" className="w-7 h-7">
                  <defs>
                    <linearGradient id="g2" x1="0" x2="1">
                      <stop offset="0" stopColor="#8b5cf6" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" r="30" fill="url(#g2)" />
                  <g fill="#fff">
                    <path d="M22 44c0-8.837 7.163-16 16-16s16 7.163 16 16H22z" />
                    <rect x="18" y="16" width="28" height="12" rx="2" />
                  </g>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight">GarageHub Support</h3>
                <p className="text-xs opacity-90">Hỗ trợ trực tuyến • Thời gian phản hồi nhanh</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-label="Minimize"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages area (less padding, shorter) */}
          <div className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-white/60 to-gray-50 backdrop-blur-sm">
            {messages.map((msg, index) => {
              const isUser = msg.senderRole === "user";
              return (
                <div
                  key={msg._id || index}
                  className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"} transition-transform duration-150`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[75%] break-words shadow-sm transform transition-all duration-150 ${isUser
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:scale-[1.01]"
                      : "bg-white text-gray-800 border border-gray-100 hover:scale-[1.01]"
                      }`}
                  >
                    <p className="text-sm mb-0.5 leading-relaxed">{msg.message}</p>
                    <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                      <span>{formatTime(msg.createdAt)}</span>
                      {isUser && msg.isRead && (
                        <svg className="w-3 h-3 text-white opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
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

          {/* Composer (smaller input & button) */}
          <form className="flex gap-3 p-3 bg-white border-t border-gray-200 items-center" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:opacity-70"
            />

            <button
              type="submit"
              className="group w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center disabled:opacity-50 transform transition hover:scale-105 active:scale-95"
              disabled={!newMessage.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7-9 7-9-7z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
