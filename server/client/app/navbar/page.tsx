"use client";
import { useState, useRef, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import {
  ChevronDown,
  Home,
  Menu,
  X,
  User,
  UserCircle,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/public/logo-2.png";
import Image from "next/image";
import { useAuthMonitor } from "@/utils/useAuthMonitor";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userRoleName, setUserRoleName] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  interface MyJwtPayload extends JwtPayload {
    email: string;
    user_id: number;
    userName: string;
    roleName: string;
  }
  // paths where Home & Account should be hidden
  const restrictedPaths = [
    "/",
    "/login",
    "/register",
    "/login-code",
    // "/check-email",
    // "/auth/callback",
  ];

  // show Home & Account only if current path is NOT in restrictedPaths
  const shouldShowNav = !restrictedPaths.includes(pathname);

  // show Home & Account only if current path is NOT in restrictedPaths
  const shouldShowHome = restrictedPaths.includes(pathname);

  const shouldMonitorAuth = !restrictedPaths.includes(pathname);

  if (shouldMonitorAuth) {
    useAuthMonitor();
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const fetchUserFromAuth = async () => {
    const JWT_Token = localStorage.getItem("JWT_Token");

    if (!JWT_Token) {
      console.log("No token stored");
      return;
    }

    // const decoded = jwtDecode(JWT_Token);
    const decoded = jwtDecode<MyJwtPayload>(JWT_Token);

    console.log(decoded.userName);
    // 2️⃣ Basic info from Auth
    setUserEmail(decoded.email);

    setUserName(decoded.userName);

    setUserRoleName(decoded.roleName);
    console.log("role", decoded.roleName);

    const params = new URLSearchParams(window.location.search);

    params.set("userId", String(decoded.user_id));
    params.set("userName", encodeURIComponent(decoded.userName));
    params.set("userEmail", encodeURIComponent(decoded.email));

    window.history.pushState({}, "", `?${params.toString()}`);
  };

  useEffect(() => {
    if (shouldMonitorAuth) {
      fetchUserFromAuth();
    }
  }, [pathname]);

  console.log("userRole", userRoleName);

  const getDashboardRoute = () => {
    let baseRoute = "";
    switch (userRoleName) {
      case "User":
        baseRoute = "/user";
        break;
      case "Functional Admin":
        baseRoute = "/functionaladmin";
        break;
      case "Technical Admin":
        baseRoute = "/technicaladmin";
        break;
      default:
        baseRoute = pathname; // fallback if no role found
    }

    // ✅ Append userId as query param if available
    return userId ? `${baseRoute}?userId=${userId}` : baseRoute;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleLogout = () => {
    signOut();
    localStorage.clear(); // Clear the session
    router.push("/");
  };

  const signOut = async () => {
    fetch(process.env.NEXT_PUBLIC_DGX_API_URL + "/login/sign-out", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        // academic_year_id: academicYearId,
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error fetching fees slab:", error));
  };
  return (
    <>
      {/* Modern Header with Link-style Navigation */}
      <header
        className="flex-shrink-0 shadow-lg border-b-2"
        style={{
          backgroundColor: "#76B900",
          borderBottomColor: "#5a8f00",
        }}
      >
        <div className="container mx-auto px-0">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl shadow-lg border-2 cursor-pointer"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e8f5d0",
                }}
                onClick={shouldShowHome ? () => router.push("/") : undefined}
              >
                <Image src={Logo} alt="Logo" width={50} height={50} />
              </div>
              <div className="text-left hidden sm:block">
                <h1 className="text-lg font-bold text-white leading-tight">
                  DGX Requisition System
                </h1>
                <p
                  className="text-sm leading-tight"
                  style={{ color: "#e8f5d0" }}
                >
                  NVIDIA High-Performance Computing Platform
                </p>
              </div>
            </div>

            {/* Right Side - Navigation Links */}
            <div className="flex items-end ml-auto space-x-0">
              <nav className="hidden md:flex items-center space-x-3">
                {shouldShowNav && (
                  <Link
                    href={getDashboardRoute()}
                    className="nav-link flex items-center space-x-1 text-white font-medium text-base transition-all duration-300 relative group"
                  >
                    <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
                  </Link>
                )}

                {/* Profile Dropdown - Only show if authenticated */}
                {shouldShowNav && (
                  <div className="relative mr-0" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="nav-link flex items-center space-x-1 text-white font-medium text-base transition-all duration-300 relative group"
                    >
                      <UserCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="space-x-5 cursor-pointer !mr-0">
                        Account
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 !mr-0 cursor-pointer transition-transform duration-300 ${
                          isProfileDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                      <div
                        className={`absolute !mr-0 -bottom-1 space-x-1 h-0.5 bg-white transition-all duration-300 ${
                          isProfileDropdownOpen
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      ></div>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div
                        className="absolute right-0 mt-3 w-80 rounded-xl shadow-2xl border overflow-hidden z-50 transform transition-all duration-300 ease-out"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#e8f5d0",
                          animation: "slideDown 0.3s ease-out",
                        }}
                      >
                        {/* User Info Section */}
                        <div
                          className="px-5 py-4 border-b"
                          style={{
                            backgroundColor: "#f8fdf0",
                            borderBottomColor: "#e8f5d0",
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2"
                              style={{
                                backgroundColor: "#76B900",
                                borderColor: "#5a8f00",
                              }}
                            >
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p
                                className="text-base font-semibold"
                                style={{ color: "#2d4a00" }}
                              >
                                {userName || "User"}
                              </p>
                              <p
                                className="text-sm"
                                style={{ color: "#5a8f00" }}
                              >
                                {userEmail || "user@example.com"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="dropdown-item flex items-center w-full px-5 py-3 text-sm font-medium transition-all duration-200"
                            style={{ color: "#2d4a00" }}
                          >
                            <User
                              className="w-5 h-5 mr-1 transition-transform duration-200"
                              style={{ color: "#76B900" }}
                            />
                            <span>My Profile</span>
                          </Link>

                          <div
                            className="border-t my-1"
                            style={{ borderColor: "#e8f5d0" }}
                          ></div>

                          <button
                            onClick={handleLogoutClick}
                            className="dropdown-item flex items-center w-full px-5 py-3 text-sm font-medium transition-all duration-200 cursor-pointer"
                            style={{ color: "#dc2626" }}
                          >
                            <LogOut className="w-5 h-5 mr-3 transition-transform duration-200 cursor-pointer" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </nav>

              {/* Confirmation Popup Modal */}
              {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-md shadow-md w-full max-w-sm mx-4">
                    {/* Content */}
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <LogOut className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Confirm Logout
                      </h3>

                      <p className="text-gray-600 mb-6">
                        Are you sure you want to logout?
                      </p>

                      {/* Action Buttons */}
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleLogout}
                          className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          onClick={cancelLogout}
                          className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white transition-all duration-300 hover:bg-white hover:bg-opacity-20 rounded-lg"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              className="md:hidden border-t-2 py-4"
              style={{ borderTopColor: "#5a8f00" }}
            >
              <div className="space-y-1">
                {shouldShowNav && (
                  <Link
                    href={getDashboardRoute()}
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-nav-link"
                  >
                    <Home className="w-5 h-5" />
                  </Link>
                )}

                {/* Mobile Profile Section - Only show if authenticated */}
                {shouldShowNav && (
                  <div
                    className="border-t-2 pt-4 mt-4"
                    style={{ borderTopColor: "rgba(255, 255, 255, 0.3)" }}
                  >
                    <div
                      className="flex items-center space-x-3 px-4 py-3 mb-3 rounded-lg"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#e8f5d0",
                        }}
                      >
                        <User
                          className="w-5 h-5"
                          style={{ color: "#76B900" }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {userName || "User"}
                        </p>
                        <p className="text-xs" style={{ color: "#e8f5d0" }}>
                          {userEmail || "user@example.com"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="mobile-nav-link flex items-center space-x-3 w-full px-4 py-3 text-white font-medium transition-all duration-300"
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                      }}
                      className="mobile-nav-link flex items-center space-x-3 w-full px-4 py-3 font-medium transition-all duration-300"
                      style={{ color: "#fca5a5" }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .nav-link:hover {
          transform: translateY(-1px);
        }

        .dropdown-item:hover {
          background-color: #f0f8e8;
          transform: translateX(4px);
          color: #76b900 !important;
        }

        .dropdown-item:hover svg {
          transform: scale(1.1);
        }

        .mobile-nav-link {
          border-radius: 8px;
        }

        .mobile-nav-link:hover {
          background-color: rgba(255, 255, 255, 0.15);
          transform: translateX(4px);
        }

        .mobile-nav-link:active {
          background-color: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </>
  );
}
