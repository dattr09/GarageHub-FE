import React from "react";
import { Mail, Phone, MapPin, Wrench, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-sky-50 via-blue-100 to-cyan-50 text-gray-800 mt-auto">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                GarageHub
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Nơi hội tụ của đam mê cơ khí và sự tận tâm phục vụ. Chúng tôi không chỉ là garage, mà còn là người bạn đồng hành đáng tin cậy trên mọi cung đường.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <a href="#" className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center hover:bg-blue-500 hover:text-white text-blue-600 transition shadow-sm">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center hover:bg-pink-500 hover:text-white text-pink-600 transition shadow-sm">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500 hover:text-white text-red-600 transition shadow-sm">
                                <Youtube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li><a href="/parts" className="text-gray-600 hover:text-blue-600 text-sm transition">Phụ tùng</a></li>
                            <li><a href="/brands" className="text-gray-600 hover:text-blue-600 text-sm transition">Hãng xe</a></li>
                            <li><a href="/appointments/book" className="text-gray-600 hover:text-blue-600 text-sm transition">Đặt lịch sửa xe</a></li>
                            <li><a href="/appointments/search" className="text-gray-600 hover:text-blue-600 text-sm transition">Tra cứu lịch hẹn</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Liên hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                </div>
                                <a href="mailto:support@garagehub.com" className="text-gray-600 hover:text-blue-600 text-sm transition">
                                    support@garagehub.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-cyan-600" />
                                </div>
                                <a href="tel:0976160200" className="text-gray-600 hover:text-blue-600 text-sm transition">
                                    +84 976 160 200
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-gray-600 text-sm">
                                    167 Rừng Sác, Bình Khánh, Cần Giờ, TP.HCM
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Map */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Địa chỉ</h3>
                        <div className="rounded-xl overflow-hidden border border-blue-200 h-40 shadow-sm">
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
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-blue-200/50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} <span className="text-blue-600 font-medium">GarageHub</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <a href="#" className="hover:text-blue-600 transition">Chính sách</a>
                        <a href="#" className="hover:text-blue-600 transition">Điều khoản</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}