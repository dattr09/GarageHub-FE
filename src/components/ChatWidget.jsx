import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./ChatWidget.css";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChatWidget = ({ userId, userToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const conversationId = userId; // User's conversation ID

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

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
      if (userRole === "admin") {
        setIsTyping(typing);
      }
    });

    newSocket.on("messages-read", () => {
      // Admin đã đọc tin nhắn
      setMessages((prev) =>
        prev.map((msg) => (msg.senderRole === "user" ? { ...msg, isRead: true } : msg))
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  // Load chat history
  const loadChatHistory = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/v1/chat/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  // Send message
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
    
    // Stop typing indicator
    socket.emit("typing", { conversationId, isTyping: false });
  };

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing event
    socket.emit("typing", { conversationId, isTyping: true });

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { conversationId, isTyping: false });
    }, 1000);
  };

  // Open chat widget
  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    
    // Mark messages as read
    if (socket) {
      socket.emit("mark-as-read", { conversationId });
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button className="chat-widget-button" onClick={handleOpen}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="chat-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          {unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget-window">
          {/* Header */}
          <div className="chat-header">
            <div>
              <h3>GarageHub Support</h3>
              <p className="chat-status">Hỗ trợ trực tuyến</p>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`chat-message ${msg.senderRole === "user" ? "user" : "admin"}`}
              >
                <div className="message-content">
                  <p>{msg.message}</p>
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message admin">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Nhập tin nhắn..."
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
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
        </div>
      )}
    </>
  );
};

export default ChatWidget;
