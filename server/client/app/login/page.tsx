"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Header from "../navbar/page";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLogin = useCallback(async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DGX_API_URL}/login/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!data.userExists) {
        setError("Account not found. Please sign up first.");
        return;
      }

      router.push(`/login-code?email=${email}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  }, [email, setError, validateEmail, setIsLoading, router]);

const fetchUserFromAuth = async () => {
  const JWT_Token = localStorage.getItem("JWT_Token");
  console.log("Checking for stored JWT_Token:", JWT_Token);

  // ------------------------------
  // 1️⃣ NO TOKEN FOUND
  // ------------------------------
  if (!JWT_Token) {
    console.log("No token stored");
    setIsCheckingAuth(false);
    return;
  }

  try {
    // Decode JWT → get exp time
    const decoded = jwtDecode(JWT_Token);
    const expiry = decoded.exp; // in seconds

    const now = Math.floor(Date.now() / 1000);

    // ------------------------------
    // 2️⃣ TOKEN EXPIRED
    // ------------------------------
    if  (!expiry || expiry < now) {
      console.log("Token expired — clearing token");
      setIsCheckingAuth(false);
      return;
    }

    // ------------------------------
    // 3️⃣ TOKEN VALID
    // ------------------------------
    console.log("Token is valid");
    setIsCheckingAuth(false);
    return;

  } catch (error) {
    console.log("Error decoding token:", error);
    // If decoding fails, treat as invalid
    localStorage.removeItem("JWT_Token");
    setIsCheckingAuth(false);
  }
};

  useEffect(() => {
    fetchUserFromAuth();
  }, [fetchUserFromAuth]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div
                className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
                style={{
                  borderTopColor: "#76B900",
                  borderRightColor: "#76B900",
                }}
              ></div>
            </div>
            <p className="text-gray-600 font-medium">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-3 ">Login</h2>
              <p className="text-sm text-[#5a8f00]">
                Enter your email to receive a login code
              </p>
            </div>

            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // prevent page reload
                }}
                className="space-y-6"
              >
                <div className="relative w-full">
                  <label
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
                  ${
                    email || focusedField === "email" || error
                      ? "text-xs -top-2 px-1"
                      : "top-3"
                  }
                  ${
                    error
                      ? "text-red-500 font-medium"
                      : email || focusedField === "email"
                      ? "text-[#5a8f00] font-medium"
                      : "text-gray-500"
                  }
                `}
                    style={{
                      backgroundColor:
                        email || focusedField === "email" || error
                          ? "#ffffff"
                          : "transparent",
                    }}
                  >
                    {error ? (
                      <span className="flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {error}
                      </span>
                    ) : (
                      "Email Address*"
                    )}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    onFocus={(e) => {
                      setFocusedField("email");
                      e.target.style.borderColor = "#76B900";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(118, 185, 0, 0.1)";
                    }}
                    onBlur={() => setFocusedField("")}
                    className="w-full px-3 pt-4 pb-2 rounded-lg focus:outline-none bg-white transition-all duration-200"
                    style={{
                      color: "#2d4a00",
                      border: error ? "2px solid #ef4444" : "2px solid #e8f5d0",
                    }}
                    placeholder={error ? "" : undefined}
                  />
                </div>

                <button
                  onClick={handleLogin}
                  type="submit" // important, so Enter key works
                  disabled={isLoading}
                  className="w-full cursor-pointer font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 text-white disabled:opacity-70"
                  style={{
                    backgroundColor: isLoading ? "#9ca3af" : "#76B900",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#5a8f00";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#76B900";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {isLoading ? "Sending OTP..." : "Get OTP"}
                </button>
              </form>
              <div className="text-center text-sm text-[#5a8f00] pt-6 border-t border-gray-200">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="text-[#76B900] font-semibold hover:underline transition-colors duration-200 cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#5a8f00";
                    e.currentTarget.style.textDecorationColor = "#5a8f00";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#76B900";
                    e.currentTarget.style.textDecorationColor = "#76B900";
                  }}
                >
                  Register here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
