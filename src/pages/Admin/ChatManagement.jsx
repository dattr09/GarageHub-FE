import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./ChatManagement.css";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChatManagement = ({ adminId, adminToken }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (!adminId) return;

    const newSocket = io(`${SOCKET_URL}/chat`, {
      query: { userId: adminId, isAdmin: "true" },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Admin connected to chat server");
      loadConversations();
    });

    newSocket.on("receive-message", (message) => {
      // Cập nhật conversation list
      loadConversations();

      // Nếu đang xem conversation này, thêm message vào
      if (selectedConversation && message.conversationId === selectedConversation.conversationId) {
        setMessages((prev) => [...prev, message]);
        
        // Mark as read
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
  }, [adminId, selectedConversation]);

  // Load all conversations
  const loadConversations = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/v1/chat/conversations`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  // Load messages of a conversation
  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/v1/chat/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Select a conversation
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.conversationId);

    // Join conversation room
    if (socket) {
      socket.emit("join-conversation", { conversationId: conversation.conversationId });
      socket.emit("mark-as-read", { conversationId: conversation.conversationId });
    }

    // Update unread count
    setConversations((prev) =>
      prev.map((conv) =>
        conv.conversationId === conversation.conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation.conversationId,
      message: newMessage.trim(),
      attachments: [],
    };

    socket.emit("send-message", messageData);
    setNewMessage("");

    // Stop typing indicator
    socket.emit("typing", { conversationId: selectedConversation.conversationId, isTyping: false });
  };

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedConversation) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing event
    socket.emit("typing", { conversationId: selectedConversation.conversationId, isTyping: true });

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        conversationId: selectedConversation.conversationId,
        isTyping: false,
      });
    }, 1000);
  };

  // Format time
  const formatTime = (timestamp) => {
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
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-management">
      <div className="chat-management-header">
        <h2>Quản lý Chat</h2>
        <button className="refresh-btn" onClick={loadConversations}>
          🔄 Làm mới
        </button>
      </div>

      <div className="chat-management-body">
        {/* Conversations List */}
        <div className="conversations-list">
          <div className="conversations-header">
            <h3>Cuộc trò chuyện</h3>
            <span className="conversations-count">{conversations.length}</span>
          </div>

          <div className="conversations-items">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <p>Chưa có cuộc trò chuyện nào</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  className={`conversation-item ${
                    selectedConversation?.conversationId === conv.conversationId ? "active" : ""
                  }`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="conversation-avatar">
                    {conv.user?.avatar ? (
                      <img src={conv.user.avatar} alt={conv.user.username} />
                    ) : (
                      <div className="avatar-placeholder">
                        {conv.user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-top">
                      <span className="conversation-name">
                        {conv.user?.username || "Unknown User"}
                      </span>
                      <span className="conversation-time">{formatTime(conv.lastMessageTime)}</span>
                    </div>
                    <div className="conversation-bottom">
                      <p className="conversation-message">{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <span className="conversation-badge">{conv.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-window-header">
                <div className="chat-user-info">
                  <div className="chat-user-avatar">
                    {selectedConversation.user?.avatar ? (
                      <img
                        src={selectedConversation.user.avatar}
                        alt={selectedConversation.user.username}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {selectedConversation.user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3>{selectedConversation.user?.username || "Unknown User"}</h3>
                    <p>{selectedConversation.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-window-messages">
                {messages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`chat-window-message ${
                      msg.senderRole === "admin" ? "admin" : "user"
                    }`}
                  >
                    <div className="message-bubble">
                      <p>{msg.message}</p>
                      <span className="message-timestamp">{formatMessageTime(msg.createdAt)}</span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-window-message user">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form className="chat-window-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Nhập tin nhắn..."
                />
                <button type="submit" disabled={!newMessage.trim()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatManagement;
