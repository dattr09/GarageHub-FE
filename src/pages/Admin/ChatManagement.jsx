import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { MessageSquare, Send, Image, X, RefreshCw, User } from "lucide-react";
import Config from "../../envVars";

const ChatManagement = ({ adminId, adminToken }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const getToken = () => adminToken || localStorage.getItem("token");
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (!adminId) return;
    const newSocket = io(`${Config.BACKEND_URL}/chat`, {
      query: { userId: adminId, isAdmin: "true" },
      transports: ["websocket"],
    });
    newSocket.on("connect", () => loadConversations());
    newSocket.on("receive-message", (message) => {
      loadConversations();
      if (selectedConversation && message.conversationId === selectedConversation.conversationId) {
        setMessages((prev) => [...prev, message]);
        newSocket.emit("mark-as-read", { conversationId: message.conversationId });
      }
    });
    newSocket.on("user-typing", ({ conversationId, isTyping: typing, userRole }) => {
      if (userRole === "user" && selectedConversation && conversationId === selectedConversation.conversationId) {
        setIsTyping(typing);
      }
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [adminId, selectedConversation]);

  const loadConversations = async () => {
    try {
      const res = await fetch(`${Config.BACKEND_URL}/api/v1/chat/conversations`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setConversations(data.conversations || []);
    } catch (err) { console.error("Error loading conversations:", err); }
  };

  const loadMessages = async (conversationId) => {
    try {
      const res = await fetch(`${Config.BACKEND_URL}/api/v1/chat/messages/${conversationId}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setMessages(data.messages || []);
    } catch (err) { console.error("Error loading messages:", err); }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    loadMessages(conv.conversationId);
    if (socket) {
      socket.emit("join-conversation", { conversationId: conv.conversationId });
      socket.emit("mark-as-read", { conversationId: conv.conversationId });
    }
    setConversations((prev) => prev.map((c) => (c.conversationId === conv.conversationId ? { ...c, unreadCount: 0 } : c)));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) { alert("Chỉ được chọn tối đa 5 ảnh"); return; }
    const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];
    const formData = new FormData();
    selectedImages.forEach(img => formData.append("images", img.file));
    try {
      const token = getToken();
      const response = await fetch(`${Config.BACKEND_URL}/api/v1/chat/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (data.success) return data.urls;
      throw new Error(data.message || "Upload failed");
    } catch (error) { console.error("Error uploading images:", error); throw error; }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedImages.length === 0) || !socket || !selectedConversation) return;
    let attachments = [];
    if (selectedImages.length > 0) {
      setIsUploading(true);
      try {
        attachments = await uploadImages();
        selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
        setSelectedImages([]);
      } catch { alert("Không thể upload ảnh."); setIsUploading(false); return; }
      setIsUploading(false);
    }
    const messageData = {
      conversationId: selectedConversation.conversationId,
      message: newMessage.trim() || (attachments.length > 0 ? "📷 Đã gửi ảnh" : ""),
      attachments,
    };
    const temp = {
      _id: `temp-${Date.now()}`,
      message: messageData.message,
      senderRole: "admin",
      createdAt: new Date().toISOString(),
      conversationId: selectedConversation.conversationId,
      attachments,
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
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins}p`;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString("vi-VN");
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 rounded-t-2xl text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Quản Lý Chat</h1>
              <p className="text-white/80 text-sm">{conversations.length} cuộc trò chuyện</p>
            </div>
            <button onClick={loadConversations} className="p-2 hover:bg-white/20 rounded-lg transition">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-xl flex h-[600px] overflow-hidden">
          <div className="w-80 border-r border-gray-100 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có cuộc trò chuyện</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const active = selectedConversation?.conversationId === conv.conversationId;
                  return (
                    <div
                      key={conv.conversationId}
                      onClick={() => handleSelectConversation(conv)}
                      className={`flex gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 transition-all ${active ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"
                        }`}
                    >
                      <div className="w-11 h-11 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        {conv.user?.avatar ? (
                          <img src={conv.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800 truncate">{conv.user?.fullName || conv.user?.username || conv.user?.name || conv.user?.email?.split('@')[0] || "Khách"}</span>
                          <span className="text-xs text-gray-400">{formatTime(conv.lastMessageTime)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedConversation.user?.fullName || selectedConversation.user?.username || selectedConversation.user?.name || selectedConversation.user?.email?.split('@')[0] || "Khách"}</h3>
                    <p className="text-xs text-gray-500">{selectedConversation.user?.email || ""}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.map((msg, idx) => {
                    const isAdmin = msg.senderRole === "admin";
                    return (
                      <div key={msg._id || idx} className={`mb-3 flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                        <div className="max-w-[70%]">
                          {msg.attachments?.length > 0 && (
                            <div className={`mb-1 flex flex-wrap gap-1 ${isAdmin ? "justify-end" : "justify-start"}`}>
                              {msg.attachments.map((url, i) => (
                                <img key={i} src={url} alt="" onClick={() => setPreviewImage(url)}
                                  className="max-w-[160px] max-h-[160px] rounded-xl cursor-pointer hover:opacity-90 object-cover" />
                              ))}
                            </div>
                          )}
                          {msg.message && msg.message !== "📷 Đã gửi ảnh" && (
                            <div className={`px-4 py-2.5 rounded-2xl ${isAdmin ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" : "bg-white text-gray-800 border border-gray-100"
                              }`}>
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs opacity-70 mt-1">{formatMessageTime(msg.createdAt)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="mb-3 flex justify-start">
                      <div className="bg-white px-4 py-3 rounded-2xl flex items-center gap-1.5 border border-gray-100">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {selectedImages.length > 0 && (
                  <div className="p-2 bg-gray-100 flex gap-2 overflow-x-auto">
                    {selectedImages.map((img, i) => (
                      <div key={i} className="relative flex-shrink-0">
                        <img src={img.preview} alt="" className="w-14 h-14 object-cover rounded-lg" />
                        <button onClick={() => removeImage(i)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {isUploading && <div className="p-2 bg-blue-50 text-center text-sm text-blue-600">Đang upload...</div>}

                <form className="flex gap-2 p-4 border-t border-gray-100 items-center" onSubmit={handleSendMessage}>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" multiple className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                    <Image className="w-5 h-5 text-gray-500" />
                  </button>
                  <input type="text" value={newMessage} onChange={handleTyping} placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="submit" disabled={!newMessage.trim() && selectedImages.length === 0}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white disabled:opacity-50 hover:shadow-lg transition">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
                <p>Chọn cuộc trò chuyện để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black/80 z-[1100] flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="" className="max-w-full max-h-full rounded-2xl" />
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatManagement;