import React, { useState, useEffect } from "react";
import NavbarCarousel from "./HomePage/NavbarCarousel";
import ServiceCards from "./HomePage/ServiceCards";
import Accessories from "./HomePage/Accessories";
import FeaturedProducts from "./HomePage/FeaturedProducts";
import ChatWidget from "../components/ChatWidget";
import { getAllParts } from "../services/PartsApi";
import { getAllBrands } from "../services/BrandApi";

export default function HomePage() {
    const [parts, setParts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const storedUserId = localStorage.getItem("userId");
        const storedToken = localStorage.getItem("token");
        
        if (storedUserId) setUserId(storedUserId);
        if (storedToken) setUserToken(storedToken);
    }, []);

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const data = await getAllParts();
                setParts(data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách phụ tùng:", error);
            }
        };

        fetchParts();
    }, []);

    return (
        <div className="w-full max-w-9xl mx-auto px-4 flex flex-col gap-8">
            <NavbarCarousel />
            <ServiceCards />
            <Accessories parts={parts} />
            <FeaturedProducts parts={parts} brands={brands} />
            
            {/* Chat Widget - chỉ hiển thị khi user đã đăng nhập */}
            {userId && userToken && (
                <ChatWidget userId={userId} userToken={userToken} />
            )}
        </div>
    );
}