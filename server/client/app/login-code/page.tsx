"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Clock } from "lucide-react";
import Header from "@/app/navbar/page";

function LoginCodeContent() {
  const [loginCode, setLoginCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  // OTP Timer states
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) {
      setIsTimerActive(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCodeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/, ""); // only digits

    // Update array
    const newCode = [...loginCode];
    newCode[index] = value;
    setLoginCode(newCode);

    // Move to next input automatically
    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[name="login-${index + 1}"]`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyCode = async (event:any) => {
    event.preventDefault();

    const fullOtp = loginCode.join("");
    if (!fullOtp || fullOtp.length !== 6) {
      setError("Enter a valid 6-digit code");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DGX_API_URL}/login/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: fullOtp }),
        }
      );

      const data = await res.json();

      if (!data.roleName) {
        setError("Invalid code. Try again.");
        return;
      }

      localStorage.setItem("userRole", data.roleName);
      localStorage.setItem("JWT_Token", data.jwt_token);
      // localStorage.setItem("userRole", data.roleName);

      switch (data.roleName) {
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
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Something went wrong. Try again.");
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DGX_API_URL}/login/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      // If API returned an error (non-200)
      if (!response.ok) {
        setError(data.message || "Failed to resend OTP");
        setIsResending(false);
        return;
      }

      // SUCCESS → reset input + restart timer
      setLoginCode(["", "", "", "", "", ""]);
      setTimeLeft(600);
      setIsTimerActive(true);
    } catch (err) {
      // Network / unexpected error
      setError("Something went wrong");
    }

    setIsResending(false);
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "white" }}
    >
      <Header />

      <div className="flex-1 flex items-center justify-center p-2">
        <div className="w-full max-w-lg">
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "#fff",
              boxShadow:
                "0 25px 50px -12px rgba(68, 73, 61, 0.15), 0 0 0 1px rgba(201, 202, 199, 0.5)",
            }}
          >
            <div className="text-center mb-3">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8" style={{ color: "#76B900" }} />
              </div>
              <h3
                className="text-xl font-bold mb-1 text-gray-800 "
                // style={{ color: "#2d4a00" }}
              >
                Enter Login Code
              </h3>
              <p className="text-sm" style={{ color: "#5a8f00" }}>
                Code sent to: <strong>{email}</strong>
              </p>

              {/* Timer Display */}
              <div className="mt-3 flex items-center justify-center space-x-2">
                <Clock
                  className="w-4 h-4"
                  style={{ color: timeLeft <= 60 ? "#ef4444" : "#76B900" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: timeLeft <= 60 ? "#ef4444" : "#76B900" }}
                >
                  {isTimerActive ? (
                    <span
                      className="text-sm font-semibold"
                      style={{ color: timeLeft <= 60 ? "#ef4444" : "#76B900" }}
                    >
                      Code expires in: {formatTime(timeLeft)}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-red-500">
                      Code expired
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <form onSubmit={handleVerifyCode} className="space-y-3">
                <div className="flex justify-center space-x-3 mb-6">
                  {loginCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`login-${index}`}
                      value={digit}
                      autoFocus={index === 0}
                      onChange={(e) => handleCodeChange(index, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && index > 0) {
                          const prevInput = document.querySelector(
                            `input[name="login-${index - 1}"]`
                          ) as HTMLInputElement;
                          if (prevInput) prevInput.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-all duration-200"
                      style={{ borderColor: "#c8cac4ff", color: "#2d4a00" }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#76B900";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(118, 185, 0, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#c8cac4ff";
                        e.target.style.boxShadow = "none";
                      }}
                      maxLength={1}
                      disabled={!isTimerActive && timeLeft <= 0}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center mb-4">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleVerifyCode}
                  disabled={isVerifying || (!isTimerActive && timeLeft <= 0)}
                  className="w-full font-semibold py-2.5 px-4 rounded-lg transition-all text-white cursor-pointer"
                  style={{
                    backgroundColor:
                      isVerifying || (!isTimerActive && timeLeft <= 0)
                        ? "#9ca3af"
                        : "#76B900",
                  }}
                  onMouseEnter={(e) => {
                    if (!isVerifying && (isTimerActive || timeLeft > 0)) {
                      e.currentTarget.style.backgroundColor = "#5a8f00";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isVerifying && (isTimerActive || timeLeft > 0)) {
                      e.currentTarget.style.backgroundColor = "#76B900";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {isVerifying
                    ? "Logging In..."
                    : !isTimerActive && timeLeft <= 0
                    ? "Code Expired"
                    : "Login"}
                </button>
              </form>

              <div
                className="text-center text-sm pt-4 border-t"
                style={{ borderColor: "#e8f5d0" }}
              >
                <p style={{ color: "#5a8f00" }}>
                  Didn't receive the code?{" "}
                  <button
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="text-[#76B900] font-semibold hover:underline transition-colors cursor-pointer"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#5a8f00";
                      e.currentTarget.style.textDecorationColor = "#5a8f00";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#76B900";
                      e.currentTarget.style.textDecorationColor = "#76B900";
                    }}
                  >
                    {isResending ? "Sending..." : "Resend Code"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------ Export with Suspense Wrapper ------------------
export default function LoginCode() {
  return (
    <Suspense fallback={<div>Loading login page...</div>}>
      <LoginCodeContent />
    </Suspense>
  );
}
