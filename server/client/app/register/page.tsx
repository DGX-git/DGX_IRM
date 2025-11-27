// "use client";
// import React, { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import Header from "../navbar/page";
// import { ChevronDown, CheckCircle, AlertCircle } from "lucide-react";
// import Link from "next/link";
// import { FormikErrors, FormikTouched } from "formik";
// import { useRouter } from 'next/navigation';

// export default function RegisterForm() {
//   interface FormData {
//     firstName: string;
//     lastName: string;
//     institute: string;
//     department: string;
//     role: string;
//     phoneNumber: string;
//     email: string;
//     acceptTerms: boolean;
//   }

//   type ErrorsType = Partial<Record<keyof FormData, string>>;

//   const [formData, setFormData] = useState<FormData>({
//     firstName: "",
//     lastName: "",
//     institute: "",
//     department: "",
//     role: "",
//     phoneNumber: "",
//     email: "",
//     acceptTerms: false,
//   });

//   const [focusedField, setFocusedField] = useState<keyof FormData | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Backend data states
//   interface Institute {
//     id: string | number;
//     institute_name: string;
//     [key: string]: any;
//   }
//   interface Department {
//     id: string | number;
//     department_name: string;
//     [key: string]: any;
//   }
//   interface RoleItem {
//     id: string | number;
//     role_name: string;
//     [key: string]: any;
//   }

//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [roles, setRoles] = useState<RoleItem[]>([]);
//   const [institutes, setInstitutes] = useState<Institute[]>([]);
//   // UI states
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   // Email validation states
//   const [emailValidationError, setEmailValidationError] = useState("");
//   const [errors, setErrors] = useState<FormikErrors<FormData>>({});
//   const [touched, setTouched] = useState<FormikTouched<FormData>>({});
//   const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

// const router = useRouter();
//   const floatCondition = (name: keyof FormData, value: unknown) =>
//     value || (errors[name] && focusedField === name);

//   useEffect(() => {
//     getInstitutes();
//     getRoles();
//   }, []);

//   const getInstitutes = async () => {
//     const { data } = await supabase.from("institute").select("*");
//     setInstitutes(data ?? []);
//   };

//   const getDepartments = async (instituteId: string | number) => {
//     const { data } = await supabase
//       .from("department")
//       .select("*")
//       .eq("institute_id", instituteId);
//     setDepartments(data ?? []);
//   };

//   const getRoles = async () => {
//     const { data } = await supabase.from("role").select("*");
//     if (data) {
//       setRoles(data ?? []);
//       // ✅ NEW: Auto-select "User" role as default
//       const userRole = data.find(
//         (role) => role.role_name?.toLowerCase() === "user"
//       );

//       if (userRole && !formData.role) {
//         setFormData((prev) => ({
//           ...prev,
//           role: userRole.role_id,
//         }));
//       }
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;
//     const fieldName = name as keyof FormData;

//     const fieldValue =
//       type === "checkbox"
//         ? e.target instanceof HTMLInputElement
//           ? e.target.checked
//           : false
//         : value;

//     setFormData((prev) => ({
//       ...prev,
//       [fieldName]: fieldValue,
//       ...(fieldName === "institute" ? { department: "" } : {}),
//     }));

//     // 👇 NEW: Fetch departments when institute changes
//     if (fieldName === "institute" && value) {
//       getDepartments(value);
//     }

//     if ((errors as any)[fieldName]) {
//       setErrors((prev) => ({
//         ...prev,
//         [fieldName]: "",
//       }));
//     }

//     if (fieldName === "email" && emailValidationError) {
//       setEmailValidationError("");
//     }
//   };

//   const handleBlur = (
//     e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const target = e.target;
//     const { name } = target;

//     setTouched((prev) => ({
//       ...prev,
//       [name]: true,
//     }));
//   };

//   const validateField = (name: keyof FormData, value: unknown) => {
//     let error = "";

//     switch (name) {
//       case "firstName":
//         if (!value || typeof value !== "string" || !value.trim()) {
//           error = "First Name is required";
//         } else if (!/^[a-zA-Z\s]+$/.test(value)) {
//           error = "First Name can only contain letters";
//         }
//         break;

//       case "lastName":
//         if (!value || typeof value !== "string" || !value.trim()) {
//           error = "Last Name is required";
//         } else if (!/^[a-zA-Z\s]+$/.test(value)) {
//           error = "Last Name can only contain letters";
//         }
//         break;

//       case "institute":
//         if (!value || value === "") {
//           error = "Please select an Institute";
//         }
//         break;

//       case "department":
//         if (!value || value === "") {
//           error = "Please select a Department";
//         }
//         break;

//       case "role":
//         if (!value || value === "") {
//           error = "Please select a Role";
//         }
//         break;

//       case "phoneNumber":
//         if (typeof value !== "string" || !value.trim()) {
//           error = "Phone Number is required";
//         } else if (!/^[+]?[0-9\s\-()]{10}$/.test(value.replace(/\s/g, ""))) {
//           error = "Please enter a valid 10 digit phone number";
//         }
//         break;

//       case "email":
//         if (typeof value !== "string" || !value.trim()) {
//           error = "Email is required";
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           error = "Please enter a valid email address";
//         } else if (emailValidationError) {
//           error = emailValidationError;
//         }
//         break;

//       case "acceptTerms":
//         if (!value) {
//           error = "You must accept the terms and conditions";
//         }
//         break;

//       default:
//         break;
//     }

//     return error;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     // 🔍 1. Check existing user
//     const res = await fetch("api/check-user", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: formData.email }),
//     });

//     const { exists, confirmed } = await res.json();

//     // ----------------------------------------------------
//     // CASE 1️⃣: USER EXISTS BUT EMAIL IS CONFIRMED
//     // ----------------------------------------------------
//     if (exists && confirmed) {
//       // setIsSubmitting(false);
//       showErrorMsg(
//         "An account with this email already exists. Please use a different email address or log in instead."
//       );
//       return;
//     }

//     // ----------------------------------------------------
//     // CASE 2️⃣: USER EXISTS BUT EMAIL NOT CONFIRMED
//     // → resend verification email
//     // ----------------------------------------------------
//     if (exists && !confirmed) {
//       const { error } = await supabase.auth.signInWithOtp({
//         email: formData.email,
//         options: {
//           // emailRedirectTo: `${window.location.origin}/login`,
//           emailRedirectTo: `${window.location.origin}/auth/callback`,
//         },
//       });

//       // setIsSubmitting(false);

//       if (error) {
//         console.error("❌ Error resending verification link:", error.message);
//         showErrorMsg("Could not resend email. Try again later.");
//         return;
//       }

//       showSuccessMsg(
//         "Your account has been created. Please check your email to verify your email address."
//       );
//       return;
//     }

//     // ----------------------------------------------------
//     // CASE 3️⃣: USER DOES NOT EXIST → create new account
//     // ----------------------------------------------------
//     const { error } = await supabase.auth.signInWithOtp({
//       email: formData.email,
//       options: {
//         data: { formData },
//         // emailRedirectTo: `${window.location.origin}/login`,
//         emailRedirectTo: `${window.location.origin}/auth/callback`,
//       },
//     });

//     // setIsSubmitting(false);

//     if (error) {
//       console.error(`❌ ${error.message}`);
//       showErrorMsg("Something went wrong. Try again.");
//     } else {
//       // showSuccessMsg(
//       //   "Your account has been created. Please check your email to verify your email address"
//       // );
//       router.push(`/check-email?email=${formData.email}`);
//     }
//   };
   
//   const validateForm = () => {
//     const newErrors: ErrorsType = {};
//     let isValid = true;

//     (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
//       const error = validateField(field, formData[field]);
//       if (error) {
//         newErrors[field] = error;
//         isValid = false;
//       }
//     });

//     setErrors(newErrors);

//     setTouched(
//       (Object.keys(formData) as Array<keyof FormData>).reduce(
//         (acc, key) => ({ ...acc, [key]: true }),
//         {} as Record<keyof FormData, boolean>
//       )
//     );
//     return isValid;
//   };

//   const handleCancel = () => {
//     // setFormData({
//     //   firstName: "",
//     //   lastName: "",
//     //   institute: "",
//     //   department: "",
//     //   role: "",
//     //   phoneNumber: "",
//     //   email: "",
//     //   acceptTerms: false,
//     // });
    
//       setFormData((prev) => ({
//     ...prev,            // keep role as it is
//     firstName: "",
//     lastName: "",
//     institute: "",
//     department: "",
//     phoneNumber: "",
//     email: "",
//     acceptTerms: false,
//   }));
//     setErrors({});
//     setTouched({});
//     setEmailValidationError("");
//   };
//   const showSuccessMsg = (message: string) => {
//     setSuccessMessage(message);
//     setShowSuccessSnackbar(true);
//     setTimeout(() => {
//       setShowErrorSnackbar(false);
//       setErrorMessage("");
//     }, 4000);
//   };
//   const showErrorMsg = (message: string) => {
//     setErrorMessage(message);
//     setShowErrorSnackbar(true);
//     // setTimeout(() => {
//     //   setShowErrorSnackbar(false);
//     //   setErrorMessage("");
//     // }, 4000);
//   };

//   const handleCloseErrorSnackbar = () => {
//     setShowErrorSnackbar(false);
//     setIsSubmitting(false);
//   };

//   // Terms and Conditions Modal Component
//   const TermsModal = () => (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl rounded-yl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
//         <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">
//             DGX H200 Instance Request Terms & Conditions
//           </h2>
//         </div>
//         <div className="p-6 space-y-6">
//           <section>
//             <h3
//               className="text-lg font-semibold mb-3"
//               style={{ color: "#76B900" }}
//             >
//               1. Instance Allocation & Usage
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               DGX H200 instances are allocated based on availability and project
//               requirements. Users must provide detailed project descriptions and
//               justify computational needs. Instance usage is monitored and
//               subject to fair usage policies.
//             </p>
//           </section>

//           <section>
//             <h3
//               className="text-lg font-semibold mb-3"
//               style={{ color: "#76B900" }}
//             >
//               2. Eligibility Requirements
//             </h3>
//             <ul className="text-gray-700 space-y-2 list-disc list-inside">
//               <li>
//                 Must be affiliated with a recognized academic or research
//                 institution
//               </li>
//               <li>
//                 Project must have clear research or educational objectives
//               </li>
//               <li>
//                 Users must have appropriate technical expertise to utilize GPU
//                 resources
//               </li>
//               <li>
//                 Compliance with institutional policies and ethical guidelines
//               </li>
//             </ul>
//           </section>

//           <section>
//             <h3
//               className="text-lg font-semibold mb-3"
//               style={{ color: "#76B900" }}
//             >
//               3. Resource Limitations
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               Instance access is time-limited and subject to scheduling
//               constraints. Maximum allocation periods will be determined based
//               on project scope and resource availability. Extensions may be
//               granted upon request and justification.
//             </p>
//           </section>

//           <section>
//             <h3
//               className="text-lg font-semibold mb-3"
//               style={{ color: "#76B900" }}
//             >
//               4. Data Security & Privacy
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               Users are responsible for securing their data and ensuring
//               compliance with data protection regulations. No sensitive personal
//               data should be processed without proper authorization. All data
//               must be removed upon instance termination.
//             </p>
//           </section>

//           <section>
//             <h3
//               className="text-lg font-semibold mb-3"
//               style={{ color: "#76B900" }}
//             >
//               5. Acceptable Use Policy
//             </h3>
//             <ul className="text-gray-700 space-y-2 list-disc list-inside">
//               <li>
//                 Resources must be used solely for approved research or
//                 educational purposes
//               </li>
//               <li>No unauthorized sharing of access credentials</li>
//               <li>Prohibition of illegal activities or malicious software</li>
//               <li>Respect for intellectual property rights</li>
//             </ul>
//           </section>

//           <section>
//             <h3
//               className="text-lg font-semibold mb-3"
//               style={{ color: "#76B900" }}
//             >
//               6. Termination & Suspension
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               Access may be terminated or suspended for violation of terms,
//               misuse of resources, or failure to comply with usage policies.
//               Users will be notified of any violations and given opportunity to
//               rectify issues where appropriate.
//             </p>
//           </section>

//           <section>
//             <h3
//               className="text-lg font-semibold mb-3"
//               style={{ color: "#76B900" }}
//             >
//               7. Limitation of Liability
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               The platform is provided &quot;as is&quot; without warranties.
//               Users acknowledge that computational resources may be subject to
//               downtime, and no guarantees are made regarding availability or
//               performance.
//             </p>
//           </section>
//         </div>

//         <div className="flex justify-center p-6 border-t border-gray-200 bg-white rounded-b-xl">
//           <button
//             onClick={() => setShowTermsModal(false)}
//             className="bg-[#76B900] cursor-pointer py-2 px-6 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = "#5a8f00";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = "#76B900";
//             }}
//           >
//             OK
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Success Snackbar Component
//   const SuccessSnackbar = () => (
//     <div
//       className={`fixed inset-x-0 bottom-10 flex justify-center z-50 transition-all duration-500 ${
//         showSuccessSnackbar
//           ? "transform translate-y-0 opacity-100"
//           : "transform translate-y-full opacity-0"
//       }`}
//     >
//       <div
//         className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 max-w-md relative"
//         style={{ backgroundColor: "#76B900", color: "white" }}
//       >
//         <CheckCircle className="w-6 h-6" style={{ color: "white" }} />
//         <div>
//           <p className="font-medium text-sm">{successMessage}</p>
//         </div>
//       </div>
//     </div>
//   );

//   // Error Snackbar Component
//   const ErrorSnackbar = () => (
//     <div
//       className={`fixed inset-x-0 bottom-10 flex justify-center z-50 transition-all duration-500 ${
//         showErrorSnackbar
//           ? "transform translate-y-0 opacity-100"
//           : "transform translate-y-full opacity-0"
//       }`}
//     >
//       <div
//         className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 max-w-md relative"
//         style={{ backgroundColor: "#ef4444", color: "white" }}
//       >
//         <AlertCircle className="w-6 h-6 flex-shrink-0" />

//         <p className="font-medium text-sm pr-6">{errorMessage}</p>

//         {/* ❌ Close Button */}
//         <button
//           onClick={handleCloseErrorSnackbar}
//           className="absolute top-3 right-4 text-white hover:text-gray-200 transition"
//         >
//           ✕
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div
//       className="h-screen flex flex-col overflow-hidden"
//       style={{
//         background: "white",
//       }}
//     >
//       <Header />
//       {/* Success Snackbar */}
//       <SuccessSnackbar />

//       {/* Error Snackbar */}
//       <ErrorSnackbar />

//       {/* Terms Modal */}
//       {showTermsModal && <TermsModal />}

//       <div className="flex-1 flex items-center justify-center p-2">
//         <div className="w-full max-w-lg">
//           <div
//             className="rounded-xl p-4"
//             style={{
//               backgroundColor: "#fff",
//               boxShadow:
//                 "0 25px 50px -12px rgba(68, 73, 61, 0.15), 0 0 0 1px rgba(201, 202, 199, 0.5)",
//             }}
//           >
//             <div className="text-center mb-3">
//               <h3 className="text-3xl font-bold text-gray-800 mb-1">
//                 Register
//               </h3>
//               <p className="text-sm text-[#5a8f00]">
//                 Join our platform to request DGX H200 instances
//               </p>
//             </div>

//             {
//               <div className="space-y-3">
//                 {/* First Name */}
//                 <div className="relative w-full">
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//                     ${
//                       floatCondition("firstName", formData.firstName)
//                         ? "text-xs -top-2 px-1"
//                         : "top-3"
//                     }
//                     ${
//                       errors.firstName && touched.firstName
//                         ? "text-red-500"
//                         : floatCondition("firstName", formData.firstName)
//                         ? // ? "text-black font-medium"
//                           "text-[#5a8f00] font-medium"
//                         : "text-gray-500"
//                     }
//                   `}
//                     style={{
//                       backgroundColor: floatCondition(
//                         "firstName",
//                         formData.firstName
//                       )
//                         ? "#ffffff"
//                         : "transparent",
//                     }}
//                   >
//                     {errors.firstName && touched.firstName
//                       ? errors.firstName
//                       : "First Name*"}
//                   </label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     maxLength={50}
//                     onChange={(e) => {
//                       // Allow only letters & spaces
//                       const onlyLetters = e.target.value.replace(
//                         /[^a-zA-Z\s]/g,
//                         ""
//                       );
//                       setFormData((prev) => ({
//                         ...prev,
//                         firstName: onlyLetters,
//                       }));

//                       // clear error dynamically if fixed
//                       if (errors.firstName && onlyLetters.trim() !== "") {
//                         setErrors((prev) => ({
//                           ...prev,
//                           firstName: "",
//                         }));
//                       }
//                     }}
//                     onFocus={(e) => {
//                       setFocusedField("firstName");
//                       e.target.style.borderColor = "#76B900";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                     }}
//                     onBlur={(e) => {
//                       setFocusedField(null);
//                       // handleBlur(e);
//                       if (!errors.firstName) {
//                         e.target.style.borderColor = "#e8f5d0";
//                         e.target.style.boxShadow = "none";
//                       }
//                     }}
//                     className={`w-full border-rounded rounded-lg px-3 pt-4 pb-2 focus:outline-none bg-white transition-all duration-200
//                     ${
//                       errors.firstName && touched.firstName
//                         ? "border-red-500 focus:border-red-500"
//                         : "hover:border-green-200"
//                     }
//                   `}
//                     style={{
//                       color: "#2d4a00",
//                       border:
//                         errors.firstName && touched.firstName
//                           ? "2px solid #ef4444"
//                           : "2px solid #e8f5d0",
//                     }}
//                   />
//                 </div>

//                 {/* Last Name */}
//                 <div className="relative w-full">
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//                     ${
//                       floatCondition("lastName", formData.lastName)
//                         ? "text-xs -top-2 px-1"
//                         : "top-3"
//                     }
//                     ${
//                       errors.lastName && touched.lastName
//                         ? "text-red-500"
//                         : floatCondition("lastName", formData.lastName)
//                         ? "text-[#5a8f00] font-medium"
//                         : "text-gray-500"
//                     }
//                   `}
//                     style={{
//                       backgroundColor: floatCondition(
//                         "lastName",
//                         formData.lastName
//                       )
//                         ? "#ffffff"
//                         : "transparent",
//                     }}
//                   >
//                     {errors.lastName && touched.lastName
//                       ? errors.lastName
//                       : "Last Name*"}
//                   </label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     maxLength={50}
//                     onChange={(e) => {
//                       // Allow only letters & spaces
//                       const onlyLetters = e.target.value.replace(
//                         /[^a-zA-Z\s]/g,
//                         ""
//                       );
//                       setFormData((prev) => ({
//                         ...prev,
//                         lastName: onlyLetters,
//                       }));

//                       // clear error dynamically if fixed
//                       if (errors.lastName && onlyLetters.trim() !== "") {
//                         setErrors((prev) => ({
//                           ...prev,
//                           lastName: "",
//                         }));
//                       }
//                     }}
//                     onFocus={(e) => {
//                       setFocusedField("lastName");
//                       e.target.style.borderColor = "#76B900";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                     }}
//                     onBlur={(e) => {
//                       setFocusedField(null);

//                       if (!errors.lastName) {
//                         e.target.style.borderColor = "#e8f5d0";
//                         e.target.style.boxShadow = "none";
//                       }
//                     }}
//                     className={`w-full border-rounded rounded-lg px-3 pt-4 pb-2 focus:outline-none bg-white transition-all duration-200
//                     ${
//                       errors.lastName && touched.lastName
//                         ? "border-red-500 focus:border-red-500"
//                         : "hover:border-green-200"
//                     }
//                   `}
//                     style={{
//                       color: "#2d4a00",
//                       border:
//                         errors.lastName && touched.lastName
//                           ? "2px solid #ef4444"
//                           : "2px solid #e8f5d0",
//                     }}
//                   />
//                 </div>

//                 {/*  */}
//                 <div className="relative w-full">
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//       ${
//         floatCondition("department", formData.institute)
//           ? "text-xs -top-2 px-1"
//           : "top-3"
//       }
//       ${
//         errors.institute && touched.institute
//           ? "text-red-500"
//           : floatCondition("department", formData.institute)
//           ? "text-[#5a8f00] font-medium"
//           : "text-gray-500"
//       }
//     `}
//                     style={{
//                       backgroundColor: floatCondition(
//                         "institute",
//                         formData.institute
//                       )
//                         ? "#ffffff"
//                         : "transparent",
//                     }}
//                   >
//                     {errors.institute && touched.institute
//                       ? errors.institute
//                       : "Institute*"}
//                   </label>

//                   <select
//                     name="institute"
//                     value={formData.institute}
//                     onChange={handleInputChange}
//                     onFocus={(e) => {
//                       setFocusedField("institute");
//                       e.target.style.borderColor = "#76B900";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                     }}
//                     onBlur={(e) => {
//                       setFocusedField(null);
//                       handleBlur(e);
//                       if (!errors.institute) {
//                         e.target.style.borderColor = "#e8f5d0";
//                         e.target.style.boxShadow = "none";
//                       }
//                     }}
//                     className={`w-full px-3 pt-4 pb-2 rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200
//       ${
//         errors.institute && touched.institute
//           ? "border-red-500 focus:border-red-500"
//           : "hover:border-green-200"
//       }
    
//     `}
//                     style={{
//                       color: "#2d4a00",
//                       border:
//                         errors.institute && touched.institute
//                           ? "2px solid #ef4444"
//                           : "2px solid #e8f5d0",
//                     }}
//                   >
//                     <option
//                       value=""
//                       style={{ color: "#9ca3af" }}
//                       disabled
//                       hidden
//                     ></option>
//                     {institutes.map((institute) => (
//                       <option
//                         key={institute.institute_id}
//                         value={institute.institute_id}
//                       >
//                         {institute.institute_name}
//                       </option>
//                     ))}
//                   </select>

//                   <ChevronDown
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
//                     style={{ color: "#76B900" }}
//                   />
//                 </div>

//                 {/* Department */}
//                 <div className="relative w-full">
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//       ${
//         floatCondition("department", formData.department)
//           ? "text-xs -top-2 px-1"
//           : "top-3"
//       }
//       ${
//         errors.department && touched.department
//           ? "text-red-500"
//           : floatCondition("department", formData.department)
//           ? "text-[#5a8f00] font-medium"
//           : "text-gray-500"
//       }
//     `}
//                     style={{
//                       backgroundColor: floatCondition(
//                         "department",
//                         formData.department
//                       )
//                         ? "#ffffff"
//                         : "transparent",
//                     }}
//                   >
//                     {errors.department && touched.department
//                       ? errors.department
//                       : "Department*"}
//                   </label>

//                   <select
//                     name="department"
//                     value={formData.department}
//                     onChange={handleInputChange}
//                     onFocus={(e) => {
//                       setFocusedField("department");
//                       e.target.style.borderColor = "#76B900";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                     }}
//                     onBlur={(e) => {
//                       setFocusedField(null);
//                       handleBlur(e);
//                       if (!errors.department) {
//                         e.target.style.borderColor = "#e8f5d0";
//                         e.target.style.boxShadow = "none";
//                       }
//                     }}
//                     className={`w-full px-3 pt-4 pb-2 rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200
//       ${
//         errors.department && touched.department
//           ? "border-red-500 focus:border-red-500"
//           : "hover:border-green-200"
//       }
    
//     `}
//                     style={{
//                       color: "#2d4a00",
//                       border:
//                         errors.department && touched.department
//                           ? "2px solid #ef4444"
//                           : "2px solid #e8f5d0",
//                     }}
//                   >
//                     <option
//                       value=""
//                       style={{ color: "#9ca3af" }}
//                       disabled
//                       hidden
//                     ></option>
//                     {departments.map((department) => (
//                       <option
//                         key={department.department_id}
//                         value={department.department_id}
//                       >
//                         {department.department_name}
//                       </option>
//                     ))}
//                   </select>

//                   <ChevronDown
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
//                     style={{ color: "#76B900" }}
//                   />
//                 </div>

//                 {/* Role */}
//                 <div className="relative w-full">
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//       ${
//         floatCondition("department", formData.role)
//           ? "text-xs -top-2 px-1"
//           : "top-3"
//       }
//       ${
//         errors.role && touched.role
//           ? "text-red-500"
//           : floatCondition("department", formData.role)
//           ? "text-[#5a8f00] font-medium"
//           : "text-gray-500"
//       }
//     `}
//                     style={{
//                       backgroundColor: floatCondition("role", formData.role)
//                         ? "#ffffff"
//                         : "transparent",
//                     }}
//                   >
//                     {errors.role && touched.role ? errors.role : "Role*"}
//                   </label>

//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleInputChange}
//                     disabled
//                     onFocus={(e) => {
//                       setFocusedField("role");
//                       e.target.style.borderColor = "#76B900";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                     }}
//                     onBlur={(e) => {
//                       setFocusedField(null);
//                       handleBlur(e);
//                       if (!errors.department) {
//                         e.target.style.borderColor = "#e8f5d0";
//                         e.target.style.boxShadow = "none";
//                       }
//                     }}
//                     // disabled={!formData.institute} // 🔴 disabled until institute selected
//                     className={`w-full px-3 pt-4 pb-2 rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200
//                    ${
//                      errors.role && touched.role
//                        ? "border-red-500 focus:border-red-500"
//                        : "hover:border-green-200"
//                    }
    
//                    `}
//                     style={{
//                       color: "#2d4a00",
//                       border:
//                         errors.role && touched.role
//                           ? "2px solid #ef4444"
//                           : "2px solid #e8f5d0",
//                     }}
//                   >
//                     <option
//                       value=""
//                       style={{ color: "#9ca3af" }}
//                       disabled
//                       hidden
//                     ></option>
//                     {roles
//                       .filter(
//                         (role) => role.role_name?.toLowerCase() === "user"
//                       )
//                       .map((role) => (
//                         <option key={role.role_id} value={role.role_id}>
//                           {role.role_name}
//                         </option>
//                       ))}
//                   </select>

//                   <ChevronDown
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
//                     style={{ color: "#76B900" }}
//                   />
//                 </div>

//                 {/* Phone Number */}
//                 <div className="relative w-full">
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//                     ${
//                       floatCondition("phoneNumber", formData.phoneNumber)
//                         ? "text-xs -top-2 px-1"
//                         : "top-3"
//                     }
//                     ${
//                       errors.phoneNumber && touched.phoneNumber
//                         ? "text-red-500"
//                         : floatCondition("phoneNumber", formData.phoneNumber)
//                         ? "text-[#5a8f00] font-medium"
//                         : "text-gray-500"
//                     }
//                   `}
//                     style={{
//                       backgroundColor: floatCondition(
//                         "phoneNumber",
//                         formData.phoneNumber
//                       )
//                         ? "#ffffff"
//                         : "transparent",
//                     }}
//                   >
//                     {errors.phoneNumber && touched.phoneNumber
//                       ? errors.phoneNumber
//                       : "Phone Number*"}
//                   </label>
//                   <input
//                     type="text"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     maxLength={10}
//                     onChange={(e) => {
//                       // allow only numbers
//                       const onlyNums = e.target.value.replace(/[^0-9]/g, "");

//                       setFormData((prev) => ({
//                         ...prev,
//                         phoneNumber: onlyNums,
//                       }));

//                       // clear error dynamically if input is valid
//                       if (errors.phoneNumber && onlyNums.length === 10) {
//                         setErrors((prev) => ({
//                           ...prev,
//                           phoneNumber: "",
//                         }));
//                       }
//                     }}
//                     onFocus={(e) => {
//                       setFocusedField("phoneNumber");
//                       e.target.style.borderColor = "#76B900";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                     }}
//                     onBlur={(e) => {
//                       setFocusedField(null);
//                       handleBlur(e);
//                       if (!errors.phoneNumber) {
//                         e.target.style.borderColor = "#e8f5d0";
//                         e.target.style.boxShadow = "none";
//                       }
//                     }}
//                     className={`w-full px-3 pt-4 pb-2 rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200
//                     ${
//                       errors.phoneNumber && touched.phoneNumber
//                         ? "border-red-500 focus:border-red-500"
//                         : "hover:border-green-200"
//                     }
//                     `}
//                     style={{
//                       color: "#2d4a00",
//                       border:
//                         errors.phoneNumber && touched.phoneNumber
//                           ? "2px solid #ef4444"
//                           : "2px solid #e8f5d0",
//                     }}
//                   />
//                 </div>

//                 {/* Email */}
//                 <div className="relative w-full">
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//                     ${
//                       floatCondition("email", formData.email)
//                         ? "text-xs -top-2 px-1"
//                         : "top-3"
//                     }
//                     ${
//                       errors.email && touched.email
//                         ? "text-red-500"
//                         : floatCondition("email", formData.email)
//                         ? "text-[#5a8f00] font-medium"
//                         : "text-gray-500"
//                     }
//                   `}
//                     style={{
//                       backgroundColor: floatCondition("email", formData.email)
//                         ? "#ffffff"
//                         : "transparent",
//                     }}
//                   >
//                     {errors.email && touched.email
//                       ? errors.email
//                       : "Email Address*"}
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     onFocus={(e) => {
//                       setFocusedField("email");
//                       e.target.style.borderColor = "#76B900";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                     }}
//                     onBlur={(e) => {
//                       setFocusedField(null);

//                       if (!errors.email) {
//                         e.target.style.borderColor = "#e8f5d0";
//                         e.target.style.boxShadow = "none";
//                       }
//                     }}
//                     className={`w-full border-rounded rounded-lg px-3 pt-4 pb-2 focus:outline-none bg-white transition-all duration-200
//                     ${
//                       errors.email && touched.email
//                         ? "border-red-500 focus:border-red-500"
//                         : "hover:border-green-200"
//                     }
//                   `}
//                     style={{
//                       color: "#2d4a00",
//                       border:
//                         errors.email && touched.email
//                           ? "2px solid #ef4444"
//                           : "2px solid #e8f5d0",
//                     }}
//                   />
//                 </div>

//                 {/* Terms and Conditions */}
//                 <div className="mt-3">
//                   <div className="flex justify-center space-x-3">
//                     <input
//                       type="checkbox"
//                       name="acceptTerms"
//                       checked={formData.acceptTerms}
//                       onChange={handleInputChange}
//                       className={`mt-0.5 w-4 h-4 rounded transition-all duration-200 cursor-pointer ${
//                         errors.acceptTerms && touched.acceptTerms
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                       style={{
//                         accentColor: "#76B900",
//                         borderColor:
//                           errors.acceptTerms && touched.acceptTerms
//                             ? "#ef4444"
//                             : "#e8f5d0",
//                       }}
//                     />
//                     <label
//                       className={`text-sm leading-relaxed transition-colors duration-200 ${
//                         errors.acceptTerms && touched.acceptTerms
//                           ? "text-red-500"
//                           : "text-gray-600"
//                       }`}
//                     >
//                       {errors.acceptTerms && touched.acceptTerms ? (
//                         <>
//                           You must accept the{" "}
//                           <button
//                             type="button"
//                             onClick={() => setShowTermsModal(true)}
//                             className="font-semibold underline transition-all duration-200 cursor-pointer"
//                             style={{ color: "#76B900" }}
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.color = "#5a8f00";
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.color = "#76B900";
//                             }}
//                           >
//                             terms and conditions
//                           </button>
//                           .
//                         </>
//                       ) : (
//                         <>
//                           I accept the{" "}
//                           <button
//                             type="button"
//                             onClick={() => setShowTermsModal(true)}
//                             className="text-[#76B900] font-semibold hover:underline transition-all duration-200 cursor-pointer"
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.color = "#5a8f00";
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.color = "#76B900";
//                             }}
//                           >
//                             terms and conditions
//                           </button>{" "}
//                           and privacy policy
//                         </>
//                       )}
//                     </label>
//                   </div>
//                 </div>

//                 {/* Buttons - Centered and Smaller Width */}
//                 <div className="flex justify-center mt-4">
//                   <div className="flex space-x-3 w-80">
//                     <button
//                       type="button"
//                       onClick={handleSubmit}
//                       disabled={isSubmitting}
//                       className="flex-1 cursor-pointer text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 focus:outline-none shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                       style={{
//                         backgroundColor: isSubmitting ? "#9ca3af" : "#76B900",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (!isSubmitting) {
//                           e.currentTarget.style.backgroundColor = "#5a8f00";
//                           e.currentTarget.style.transform = "translateY(-1px)";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (!isSubmitting) {
//                           e.currentTarget.style.backgroundColor = "#76B900";
//                           e.currentTarget.style.transform = "translateY(0)";
//                         }
//                       }}
//                     >
//                       {isSubmitting ? "Registering..." : "Register"}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleCancel}
//                       disabled={isSubmitting}
//                       className="flex-1 cursor-pointer text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 focus:outline-none shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                       style={{
//                         backgroundColor: isSubmitting ? "#9ca3af" : "#76B900",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (!isSubmitting) {
//                           e.currentTarget.style.backgroundColor = "#5a8f00";
//                           e.currentTarget.style.transform = "translateY(-1px)";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (!isSubmitting) {
//                           e.currentTarget.style.backgroundColor = "#76B900";
//                           e.currentTarget.style.transform = "translateY(0)";
//                         }
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             }
//             {/* Already have account link */}
//             <div
//               className="text-center mt-3 pt-3"
//               style={{ borderTop: "1px solid #e8f5d0" }}
//             >
//               <p className="text-sm text-[#5a8f00]">
//                 Already have an account?{" "}
//                 <Link
//                   href="/login"
//                   className="font-semibold hover:underline transition-all duration-200 cursor-pointer"
//                   style={{ color: "#76B900" }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.color = "#5a8f00";
//                     e.currentTarget.style.textDecorationColor = "#5a8f00";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.color = "#76B900";
//                     e.currentTarget.style.textDecorationColor = "#76B900";
//                   }}
//                 >
//                   Log in here
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
