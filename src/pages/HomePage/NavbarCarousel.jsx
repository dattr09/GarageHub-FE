import React, { useEffect, useState } from "react";

const images = [
  "/public/image5.jpg",
  "/public/image6.jpg",
  "/public/image7.jpg",
  "/public/image8.jpg",
];

const captions = [
  "GarageHub\nGiải pháp phụ tùng xe máy toàn diện",
  "Đa dạng sản phẩm, chính hãng\nGiá tốt, dịch vụ tận tâm",
  "Hỗ trợ kỹ thuật và bảo hành uy tín",
  "Đặt hàng nhanh chóng, giao hàng tận nơi",
];

export default function NavbarCarousel() {
  const [current, setCurrent] = useState(0);

  // Tự động chuyển ảnh carousel sau mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Chuyển về ảnh trước
  const prevImage = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  // Chuyển về ảnh sau
  const nextImage = () =>
    setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="w-full h-[92vh] relative overflow-hidden rounded-xl bg-white">
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`image-${idx + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${current === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-black/45 z-20"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4 text-center">
          {captions[current].split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </h1>
      </div>
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent w-10 h-10 flex items-center justify-center z-40 transition"
        onClick={prevImage}
        aria-label="Ảnh trước"
        type="button"
        style={{ border: "none", boxShadow: "none" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent w-10 h-10 flex items-center justify-center z-40 transition"
        onClick={nextImage}
        aria-label="Ảnh sau"
        type="button"
        style={{ border: "none", boxShadow: "none" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border ${current === idx
              ? "bg-white border-white scale-110 shadow"
              : "bg-white/30 border-transparent"
              }`}
            onClick={() => setCurrent(idx)}
            aria-label={`Chọn ảnh ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}