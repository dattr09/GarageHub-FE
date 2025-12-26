import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Calendar, Bell } from "lucide-react";
import { toast } from "react-hot-toast";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AppointmentNotification = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [isAdminOrEmployee, setIsAdminOrEmployee] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Kiểm tra user có phải admin hoặc employee không
    const checkUserRole = () => {
      try {
        const userStr = localStorage.getItem("user");
        const userIdFromStorage = localStorage.getItem("userId");
        
        if (userStr) {
          const user = JSON.parse(userStr);
          const roles = user.roles || [];
          const isAdmin = roles.includes("admin") || roles.includes("ADMIN");
          const isEmployee = roles.includes("employee") || roles.includes("EMPLOYEE");
          
          if (isAdmin || isEmployee) {
            setIsAdminOrEmployee(true);
            // Ưu tiên lấy từ localStorage userId, sau đó từ user object
            setUserId(userIdFromStorage || user.userId || user._id || user.id);
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkUserRole();
  }, []);

  useEffect(() => {
    // Chỉ kết nối socket nếu là admin hoặc employee
    if (!isAdminOrEmployee || !userId) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const user = JSON.parse(userStr);
    const roles = user.roles || [];
    const role = roles.includes("admin") || roles.includes("ADMIN") ? "admin" : "employee";

    const newSocket = io(`${SOCKET_URL}/appointments`, {
      query: { userId, role },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to appointment notification socket");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from appointment notification socket");
    });

    // Nhận thông báo lịch hẹn mới
    newSocket.on("new-appointment", (data) => {
      console.log("📅 New appointment notification:", data);
      
      // Hiển thị toast notification
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Lịch hẹn mới
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {data.message || `Khách hàng: ${data.appointment?.customerName} - ${data.appointment?.phone}`}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {data.appointment?.date && new Date(data.appointment.date).toLocaleDateString("vi-VN")} lúc {data.appointment?.time}
                </p>
              </div>
            </div>
            <div className="mt-3 flex space-x-3">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/appointments");
                }}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Xem chi tiết
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ), {
        duration: 10000, // Hiển thị trong 10 giây
      });
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [isAdminOrEmployee, userId, navigate]);

  // Component này không render gì cả, chỉ chạy logic kết nối socket
  return null;
};

export default AppointmentNotification;

