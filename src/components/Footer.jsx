import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 text-gray-800 px-4 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-4 text-sm">
                {/* Giới thiệu */}
                <div className="font-poppins">
                    <h2 className="text-2xl font-semibold mb-2 text-pink-600">GarageHub</h2>
                    <p className="text-gray-700 text-base leading-relaxed tracking-wide">
                        GarageHub - nơi hội tụ của đam mê cơ khí và sự tận tâm phục vụ.
                        Chúng tôi không chỉ là garage, mà còn là người bạn đồng hành đáng tin cậy trên mọi cung đường.
                        Hơn cả sửa chữa, chúng tôi trao gửi sự an tâm.
                    </p>
                </div>

                {/* Thông tin liên hệ */}
                <div className="text-center font-poppins">
                    <h2 className="text-2xl font-semibold mb-2 text-yellow-600">Thông tin liên hệ</h2>
                    <ul className="space-y-2 text-gray-700 text-base tracking-wide">
                        <li className="flex justify-center items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-700" />
                            <a href="mailto:support@garagehub.com" className="hover:text-blue-900 transition">
                                support@garagehub.com
                            </a>
                        </li>
                        <li className="flex justify-center items-center gap-2">
                            <Phone className="w-5 h-5 text-blue-700" />
                            <a href="tel:0123456789" className="hover:text-blue-900 transition">
                                +84 976 160 200
                            </a>
                        </li>
                        <li className="flex justify-center items-center text-center">
                            <MapPin className="w-5 h-5 text-blue-700" />
                            167 Rừng Sác, Bình Khánh, Cần Giờ, Hồ Chí Minh
                        </li>
                    </ul>
                </div>

                {/* Google Map */}
                <div className="text-right">
                    <h2 className="text-xl font-bold mb-2 text-green-500">Địa chỉ cửa hàng</h2>
                    <div className="rounded-2xl overflow-hidden border-2 border-indigo-400 shadow-lg w-full h-40 md:h-52">
                        <iframe
                            title="Garage Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.943179700641!2d106.77869349999999!3d10.661110100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31753b0437ffde13%3A0x10bddefcafd15411!2zVGnhu4dtIFPhu61hIFhlIFTDoGkgQ-G6p24gR2nhu50!5e1!3m2!1sen!2s!4v1750587390954!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Bản quyền */}
            <div className="text-center text-blue-800 text-xs pt-2 font-poppins">
                &copy; {new Date().getFullYear()}{" "}
                <span className="text-blue-900 font-semibold">GarageHub</span>. All rights reserved.
            </div>
        </footer>
    );
}