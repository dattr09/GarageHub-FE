import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthenContainer = () => {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
            <div className="relative w-full max-w-xl h-[500px]">
                {/* Container for sliding forms */}
                <div
                    className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out
            ${showLogin ? "translate-x-0" : "-translate-x-full"}`}
                    style={{ zIndex: showLogin ? 2 : 1 }}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <Login onSwitch={() => setShowLogin(false)} />
                    </div>
                </div>
                <div
                    className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out
            ${showLogin ? "translate-x-full" : "translate-x-0"}`}
                    style={{ zIndex: showLogin ? 1 : 2 }}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <Register onSwitch={() => setShowLogin(true)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthenContainer;