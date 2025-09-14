import React from "react";
import Navbar from "../pages/Navbar";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-8">{children}</div>
    </div>
  );
};

export default UserLayout;