import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Send, Image, X, MessageCircle } from "lucide-react";

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const conversationId = userId;
  const getToken = () => userToken || localStorage.getItem("token");

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const isAdminUser =
          (Array.isArray(user.roles) && (user.roles.includes("admin") || user.roles.includes("ADMIN"))) ||
          user.role === "admin" || user.role === "ADMIN" || user.isAdmin === true;
        if (isAdminUser) setIsAdmin(true);
      }
    } catch (error) { console.error("Error checking user role:", error); }
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (!userId || isAdmin) return;
    const newSocket = io(`${SOCKET_URL}/chat`, { query: { userId, isAdmin: "false" }, transports: ["websocket"] });
    newSocket.on("connect", () => { loadChatHistory(); });
    newSocket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.senderRole === "admin" && !isOpen) setUnreadCount((prev) => prev + 1);
    });
    newSocket.on("user-typing", ({ isTyping: typing, userRole }) => {
      if (userRole === "admin") setIsTyping(typing);
    });
    newSocket.on("messages-read", () => {
      setMessages((prev) => prev.map((msg) => (msg.senderRole === "user" ? { ...msg, isRead: true } : msg)));
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [userId, isAdmin]);

  const loadChatHistory = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${SOCKET_URL}/api/v1/chat/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        // Count unread messages from admin
        const unread = data.messages.filter(m => m.senderRole === "admin" && !m.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) { console.error("Error loading chat history:", error); }
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
      const response = await fetch(`${SOCKET_URL}/api/v1/chat/upload`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData,
      });
      const data = await response.json();
      if (data.success) return data.urls;
      throw new Error(data.message || "Upload failed");
    } catch (error) { console.error("Error uploading images:", error); throw error; }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedImages.length === 0) || !socket) return;
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
      conversationId,
      message: newMessage.trim() || (attachments.length > 0 ? "📷 Đã gửi ảnh" : ""),
      attachments,
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
    if (isAdmin) { navigate("/admin/chat"); return; }
    setIsOpen(true);
    setUnreadCount(0);
    if (socket) socket.emit("mark-as-read", { conversationId });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Floating Button - Sky Blue Theme */}
      {!isOpen && (
        <button
          aria-label="Open chat"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500 shadow-xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-2xl z-[1000]"
          style={{ boxShadow: "0 4px 20px rgba(14, 165, 233, 0.4)" }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[22px] h-[22px] flex items-center justify-center text-xs font-bold px-1 animate-bounce">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window - Sky Blue Theme */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[1000] border border-gray-200"
          style={{ maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 100px)" }}>

          {/* Header - Sky Blue Gradient */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">GarageHub Support</h3>
                <p className="text-xs text-white/80">Hỗ trợ trực tuyến 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/20 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 mx-auto mb-3 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-500 text-sm">Xin chào! Tôi có thể giúp gì cho bạn?</p>
              </div>
            )}
            {messages.map((msg, index) => {
              const isUser = msg.senderRole === "user";
              return (
                <div key={msg._id || index} className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[75%]">
                    {msg.attachments?.length > 0 && (
                      <div className={`mb-1 flex flex-wrap gap-1 ${isUser ? "justify-end" : "justify-start"}`}>
                        {msg.attachments.map((url, i) => (
                          <img key={i} src={url} alt="" onClick={() => setPreviewImage(url)}
                            className="max-w-[140px] max-h-[140px] rounded-xl cursor-pointer hover:opacity-90 object-cover" />
                        ))}
                      </div>
                    )}
                    {msg.message && msg.message !== "📷 Đã gửi ảnh" && (
                      <div className={`px-4 py-2.5 rounded-2xl ${isUser
                        ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white"
                        : "bg-white text-gray-800 border border-gray-100 shadow-sm"}`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">{formatTime(msg.createdAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="mb-3 flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl flex items-center gap-1.5 border border-gray-100 shadow-sm">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="p-2 bg-gray-50 flex gap-2 overflow-x-auto border-t border-gray-100">
              {selectedImages.map((img, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <img src={img.preview} alt="" className="w-14 h-14 object-cover rounded-lg" />
                  <button onClick={() => removeImage(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {isUploading && <div className="p-2 bg-blue-50 text-center text-sm text-blue-600">Đang upload...</div>}

          {/* Input - Blue Theme */}
          <form className="flex gap-2 p-3 bg-white border-t border-gray-100 items-center" onSubmit={handleSendMessage}>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" multiple className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <Image className="w-5 h-5 text-gray-500" />
            </button>
            <input type="text" value={newMessage} onChange={handleTyping} placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <button type="submit" disabled={!newMessage.trim() && selectedImages.length === 0}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-white disabled:opacity-50 hover:shadow-lg transition">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 z-[1100] flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="" className="max-w-full max-h-full rounded-2xl" />
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
