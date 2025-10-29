import React, { useState, useEffect } from "react";
import NavbarCarousel from "./HomePage/NavbarCarousel";
import ServiceCards from "./HomePage/ServiceCards";
import Accessories from "./HomePage/Accessories";
import FeaturedProducts from "./HomePage/FeaturedProducts";
import { getAllParts } from "../services/PartsApi";
import { getAllBrands } from "../services/BrandApi";

export default function HomePage() {
    const [parts, setParts] = useState([]);
    const [brands, setBrands] = useState([]);

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
            <Accessories parts={parts} /> {/* Truyền `parts` vào Accessories */}
            <FeaturedProducts parts={parts} brands={brands} />
        </div>
    );
}