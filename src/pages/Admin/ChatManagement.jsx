import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChatManagement = ({ adminId, adminToken }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket init for admin
  useEffect(() => {
    if (!adminId) return;

    const newSocket = io(`${SOCKET_URL}/chat`, {
      query: { userId: adminId, isAdmin: "true" },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      loadConversations();
    });

    newSocket.on("receive-message", (message) => {
      loadConversations();
      if (selectedConversation && message.conversationId === selectedConversation.conversationId) {
        setMessages((prev) => [...prev, message]);
        newSocket.emit("mark-as-read", { conversationId: message.conversationId });
      }
    });

    newSocket.on("user-typing", ({ conversationId, isTyping: typing, userRole }) => {
      if (
        userRole === "user" &&
        selectedConversation &&
        conversationId === selectedConversation.conversationId
      ) {
        setIsTyping(typing);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
    // eslint-disable-next-line
  }, [adminId, selectedConversation]);

  // Fetch conversations
  const loadConversations = async () => {
    try {
      const res = await fetch(`${SOCKET_URL}/api/v1/chat/conversations`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
        // Tính tổng số tin nhắn chưa đọc
        const total = (data.conversations || []).reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        setTotalUnread(total);
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  };

  // Fetch messages for a conversation
  const loadMessages = async (conversationId) => {
    try {
      const res = await fetch(`${SOCKET_URL}/api/v1/chat/messages/${conversationId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages || []);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    loadMessages(conv.conversationId);

    if (socket) {
      socket.emit("join-conversation", { conversationId: conv.conversationId });
      socket.emit("mark-as-read", { conversationId: conv.conversationId });
    }

    setConversations((prev) =>
      prev.map((c) => (c.conversationId === conv.conversationId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation.conversationId,
      message: newMessage.trim(),
      attachments: [],
    };

    // optimistic UI
    const temp = {
      _id: `temp-${Date.now()}`,
      message: newMessage.trim(),
      senderRole: "admin",
      createdAt: new Date().toISOString(),
      conversationId: selectedConversation.conversationId,
    };

    setMessages((prev) => [...prev, temp]);
    setNewMessage("");

    socket.emit("send-message", messageData);
    socket.emit("typing", { conversationId: selectedConversation.conversationId, isTyping: false });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !selectedConversation) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    socket.emit("typing", { conversationId: selectedConversation.conversationId, isTyping: true });

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { conversationId: selectedConversation.conversationId, isTyping: false });
    }, 1000);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="flex w-[1100px] h-[700px] bg-white/80 shadow-2xl rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <div className="w-[340px] min-w-[260px] max-w-[400px] bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shadow">
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
              <h2 className="text-base font-semibold text-white">GarageHub Chat Admin</h2>
              <span className="text-xs text-white/80">Quản lý cuộc trò chuyện</span>
            </div>
            <button
              onClick={loadConversations}
              className="ml-auto px-3 py-1.5 bg-white/20 text-white rounded-md text-xs font-medium hover:bg-white/30 transition"
              title="Làm mới"
            >
              🔄
            </button>
          </div>
          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-400">Chưa có cuộc trò chuyện nào</div>
            ) : (
              conversations.map((conv) => {
                const active = selectedConversation?.conversationId === conv.conversationId;
                return (
                  <div
                    key={conv.conversationId}
                    onClick={() => handleSelectConversation(conv)}
                    className={`flex gap-3 px-5 py-3 items-center cursor-pointer border-b border-gray-100 transition-all duration-150 group ${active
                      ? "bg-gradient-to-r from-indigo-100 to-purple-100 border-l-4 border-indigo-500"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="w-11 h-11 rounded-full flex-shrink-0 overflow-hidden shadow">
                      {conv.user?.avatar ? (
                        <img src={conv.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          <svg viewBox="0 0 24 24" className="w-6 h-6 opacity-80">
                            <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.1" />
                            <path d="M12 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="white" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800 truncate">{conv.user?.name || "Khách"}</span>
                        <span className="text-xs text-gray-400 ml-2">{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 mt-1">
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow animate-pulse">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shadow">
                  <svg viewBox="0 0 64 64" className="w-7 h-7">
                    <defs>
                      <linearGradient id="g3" x1="0" x2="1">
                        <stop offset="0" stopColor="#8b5cf6" />
                        <stop offset="1" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <circle cx="32" cy="32" r="30" fill="url(#g3)" />
                    <g fill="#fff">
                      <path d="M22 44c0-8.837 7.163-16 16-16s16 7.163 16 16H22z" />
                      <rect x="18" y="16" width="28" height="12" rx="2" />
                    </g>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-tight">GarageHub Support</h3>
                  <p className="text-xs opacity-90">{selectedConversation.user?.email || "Khách"}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-white/60 to-gray-50 backdrop-blur-sm">
                {messages.map((msg, idx) => {
                  const isAdminMsg = msg.senderRole === "admin";
                  return (
                    <div
                      key={msg._id || idx}
                      className={`mb-3 flex ${isAdminMsg ? "justify-end" : "justify-start"} transition-transform duration-150`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-2xl max-w-[75%] break-words shadow-sm transform transition-all duration-150 ${isAdminMsg
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:scale-[1.01]"
                          : "bg-white text-gray-800 border border-gray-100 hover:scale-[1.01]"
                          }`}
                      >
                        <p className="text-sm mb-0.5 leading-relaxed">{msg.message}</p>
                        <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                          <span>{formatMessageTime(msg.createdAt)}</span>
                          {isAdminMsg && msg.isRead && (
                            <svg className="w-3 h-3 text-white opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* typing indicator - small */}
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

              {/* Input */}
              <form className="flex gap-3 p-4 bg-white border-t border-gray-200 items-center" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:opacity-70"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="group w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white disabled:opacity-50 transform transition hover:scale-105 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7-9 7-9-7z" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <p className="text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatManagement;