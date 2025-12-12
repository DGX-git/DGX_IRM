"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Create floating particles
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const router = useRouter();
  const handleButtonClick = (type: string) => {
    if (type === "Register") {
      router.push("/register");
    }
    if (type === "Login") {
      router.push("/login");
    }
  };
  const fetchUserFromAuth = async () => {
    const token = localStorage.getItem("JWT_Token");
    const userRole = localStorage.getItem("userRole");

    if (!token || !userRole) {
      return; // No redirect, token missing → stay on login
    }

    try {
      const decoded = jwtDecode(token);

      // Check if token is expired
      if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
        // Token NOT expired → redirect based on role
        switch (userRole) {
          case "User":
            router.push("/user");
            break;
          case "Technical Admin":
            router.push("/technicaladmin");
            break;
          case "Functional Admin":
            router.push("/functionaladmin");
            break;
          default:
            router.push("/");
        }
      } else {
        console.log("Token expired — do nothing");
      }
    } catch (err) {
      console.log("Invalid token");
    }
  };

  useEffect(() => {
    fetchUserFromAuth();
  }, [fetchUserFromAuth]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-900/15 to-black">
      {/* Background Image - Reduced opacity for better text readability */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(107, 139, 51, 1), rgba(0, 0, 0, 0.4)), url('./home-bg.png')`,
        }}
      />

      {/* Additional dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Circuit Pattern Overlay - Increased opacity slightly for more visibility */}
      <div className="absolute inset-0 opacity-8">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(118, 185, 0, 0.4) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(118, 185, 0, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px, 60px 60px",
            animation: "circuitMove 20s linear infinite",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div
          className={`text-center max-w-4xl transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Logo Section */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-[rgba(125,187,19,0.95)] to-[rgba(125,187,19,0.75)] bg-clip-text text-transparent mb-2 drop-shadow-2xl">
              DGX
            </h1>
            <div className="text-gray-200/90 text-xl md:text-2xl font-light tracking-[0.3em] uppercase">
              Requisition System
            </div>
          </div>

          {/* Main Tagline */}
          <h2
            className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white/95 mb-6 leading-tight transition-all duration-1000 delay-500 ${
              isLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            Unleash the Power of AI with{" "}
            <span className="bg-gradient-to-r from-[rgba(125,187,19,0.95)] to-[rgba(125,187,19,0.75)] bg-clip-text text-transparent">
              NVIDIA DGX
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-xl md:text-2xl text-gray-200/80 mb-12 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-700 ${
              isLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-20"
            }`}
          >
            Experience next-generation AI computing with seamless requisition
            management. Access powerful NVIDIA DGX systems and accelerate your
            machine learning workflows.
          </p>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center  ${
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <button
              onClick={() => handleButtonClick("Register")}
              className="group relative px-8 py-4 cursor-pointer
                bg-gradient-to-r from-[rgba(125,187,19,0.9)] to-[rgba(125,187,19,0.75)] 
                text-white text-lg font-semibold rounded-full shadow-2xl 
                hover:shadow-[rgba(125,187,19,0.4)/25] 
                transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 
                overflow-hidden w-full sm:w-auto min-w-[200px]
                border border-[rgba(125,187,19,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#89bb32ff] to-[rgba(125, 187, 19, 0.85)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
              <span className="relative z-10">Register</span>
            </button>

            <button
              onClick={() => handleButtonClick("Login")}
              className="group relative px-8 py-4 cursor-pointer
                bg-white/8 backdrop-blur-md text-white/95 text-lg font-semibold rounded-full 
                border-2 border-white/20 shadow-2xl hover:shadow-white/5 
                transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 
                hover:bg-white/15 hover:border-[rgba(125,187,19,0.4)] 
                overflow-hidden w-full sm:w-auto min-w-[200px]"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-[rgba(125,187,19,0.15)] to-transparent transition-transform duration-700" />
              <span className="relative z-10">Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
