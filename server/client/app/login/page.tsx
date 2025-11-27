// "use client";
// import { useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { AlertCircle } from "lucide-react";
// import Header from "../navbar/page";
// import { supabase } from "@/lib/supabaseClient";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [focusedField, setFocusedField] = useState("");
//   const router = useRouter();

//   const fetchUserRole = async (email: string): Promise<string | null> => {
//     try {
//       // -----------------------------------------
//       // 1️⃣ Fetch user by email
//       // -----------------------------------------
//       const { data: user, error: userError } = await supabase
//         .from("dgx_user")
//         .select("user_id, role_id")
//         .eq("email_id", email.trim().toLowerCase())
//         .maybeSingle();

//       if (userError) {
//         console.error("Error fetching user:", userError);
//         return null;
//       }

//       if (!user) {
//         console.warn("No user found for email");
//         return null;
//       }

//       if (!user.role_id) {
//         console.warn("No role_id found for user");
//         return null;
//       }

//       // -----------------------------------------
//       // 2️⃣ Fetch role by id
//       // -----------------------------------------
//       const { data: role, error: roleError } = await supabase
//         .from("role")
//         .select("role_name")
//         .eq("role_id", user.role_id)
//         .maybeSingle();

//       if (roleError) {
//         console.error("Error fetching role:", roleError);
//         return null;
//       }

//       return role?.role_name ?? null;
//     } catch (error) {
//       console.error("Error fetching user role:", error);
//       return null;
//     }
//   };

//   const validateEmail = (value: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(value);
//   };

//   const handleSendLoginCode = useCallback(async () => {
//     if (!email.trim()) {
//       setError("Email is required");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email");
//       return;
//     }

//     setIsLoading(true);

//     // 🔍 1. Check user
//     const res = await fetch("api/check-user", {
//       method: "POST",
//       body: JSON.stringify({ email }),
//     });

//     const { exists, confirmed } = await res.json();

//     // ❌ User not registered
//     if (!exists) {
//       setError("Account not found. Please sign up first.");
//       setIsLoading(false);
//       return;
//     }

//     // ❌ User registered but NOT confirmed
//     if (!confirmed) {
//       setError("Account not found. Please sign up first.");
//       setIsLoading(false);
//       return;
//     }

//     // ✅ User exists + confirmed → send OTP
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         shouldCreateUser: false,
//       },
//     });

//     if (error) {
//       setError(error.message);
//       setIsLoading(false);
//       return;
//     }

//     // ⚡ Generate URL params for role
//     const role = await fetchUserRole(email);
//     const params = new URLSearchParams();
//     params.append("email", email.trim().toLowerCase());
//     if (role) params.append("role", role);

//     // 🔹 Redirect immediately BEFORE sending OTP
//     router.push("/login-code?" + params.toString());

//     setIsLoading(false);
//   }, [email]);

//   return (
//     <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
//       <Header />
//       <div className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-lg shadow-lg p-8">
//             <div className="text-center mb-6">
//               <h2 className="text-3xl font-bold text-gray-800 mb-3 ">Login</h2>
//               <p className="text-sm text-[#5a8f00]">
//                 Enter your email to receive a login code
//               </p>
//             </div>

//             <div className="space-y-6">
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault(); // prevent page reload
//                 }}
//                 className="space-y-6"
//               >
//                 <div className="relative w-full">
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//                   ${
//                     email || focusedField === "email" || error
//                       ? "text-xs -top-2 px-1"
//                       : "top-3"
//                   }
//                   ${
//                     error
//                       ? "text-red-500 font-medium"
//                       : email || focusedField === "email"
//                         ? "text-[#5a8f00] font-medium"
//                         : "text-gray-500"
//                   }
//                 `}
//                     style={{
//                       backgroundColor:
//                         email || focusedField === "email" || error
//                           ? "#ffffff"
//                           : "transparent",
//                     }}
//                   >
//                     {error ? (
//                       <span className="flex items-center">
//                         <AlertCircle className="w-3 h-3 mr-1" />
//                         {error}
//                       </span>
//                     ) : (
//                       "Email Address*"
//                     )}
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={email}
//                     onChange={(e) => {
//                       setEmail(e.target.value);
//                       if (error) setError("");
//                     }}
//                     onFocus={(e) => {
//                       setFocusedField("email");
//                       e.target.style.borderColor = "#76B900";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                     }}
//                     onBlur={() => setFocusedField("")}
//                     className="w-full px-3 pt-4 pb-2 rounded-lg focus:outline-none bg-white transition-all duration-200"
//                     style={{
//                       color: "#2d4a00",
//                       border: error ? "2px solid #ef4444" : "2px solid #e8f5d0",
//                     }}
//                     placeholder={error ? "" : undefined}
//                   />
//                 </div>

//                 <button
//                   onClick={handleSendLoginCode}
//                   type="submit" // important, so Enter key works
//                   disabled={isLoading}
//                   className="w-full cursor-pointer font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 text-white disabled:opacity-70"
//                   style={{
//                     backgroundColor: isLoading ? "#9ca3af" : "#76B900",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = "#5a8f00";
//                     e.currentTarget.style.transform = "translateY(-1px)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = "#76B900";
//                     e.currentTarget.style.transform = "translateY(0)";
//                   }}
//                 >
//                   {isLoading ? "Sending OTP..." : "Get OTP"}
//                 </button>
//               </form>
//               <div className="text-center text-sm text-[#5a8f00] pt-6 border-t border-gray-200">
//                 Don't have an account?{" "}
//                 <button
//                   onClick={() => router.push("/register")}
//                   className="text-[#76B900] font-semibold hover:underline transition-colors duration-200 cursor-pointer"
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.color = "#5a8f00";
//                     e.currentTarget.style.textDecorationColor = "#5a8f00";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.color = "#76B900";
//                     e.currentTarget.style.textDecorationColor = "#76B900";
//                   }}
//                 >
//                   Register here
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
