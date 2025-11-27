// // app/check-email/page.tsx
// import Link from "next/link";
// import Header from "../navbar/page";

// export default function CheckEmailPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <div className="flex items-center justify-center px-4 py-16">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8">

//           {/* Icon */}
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-[#76B900]/10 border border-[#76B900]/30 rounded-full flex items-center justify-center">
//               <svg
//                 className="w-8 h-8 text-[#76B900]"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Title */}
//           <h1 className="text-2xl font-semibold text-gray-900 text-center">
//             Check Your Email
//           </h1>

//           <p className="text-gray-600 text-center mt-2">
//             A verification link has been sent to your email.
//           </p>

//           {/* Info Box */}
//           <div className="mt-6 bg-gray-100 border border-gray-200 rounded-lg p-4">
//             <p className="text-gray-700 text-sm">
//               Please open your inbox and click the verification link to activate your account.
//             </p>
//             <ul className="mt-3 text-sm text-gray-600 space-y-1">
//               <li>• Check your spam/junk folder</li>
//               <li>• The link is valid for a limited time</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// app/check-email/page.tsx
"use client";
import Link from "next/link";
import Header from "../navbar/page";

export default function CheckEmailPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#76B900]/10 border-2 border-[#76B900]/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[#76B900]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Check Your Email
          </h1>

          <p className="text-sm text-[#5a8f00] text-center text-base mb-5">
            We've sent a verification link to your email address.
          </p>

          {/* Info Box */}
          <div className="bg-[#76B900]/5 border border-[#76B900]/20 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Next Steps:
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-[#76B900] font-bold mr-2 mt-0.5">✓</span>
                <span>Check your email inbox (and spam folder)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#76B900] font-bold mr-2 mt-0.5">✓</span>
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#76B900] font-bold mr-2 mt-0.5">✓</span>
                <span>Complete your account setup</span>
              </li>
            </ul>
            <p className="text-xs text-amber-800 flex items-center justify-center mt-4">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>The verification link will expire in 10 minutes</span>
            </p>
          </div>

          {/* Important Note */}
          {/* <div className="mt-5 p-4 bg-amber-50 rounded-lg">
  <p className="text-xs text-amber-800 flex items-center justify-center">
    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    <span>The verification link will expire in 10 minutes</span>
  </p>
</div> */}

          {/* Login Button */}
          <div className="mt-5 text-center">
            <p className="text-sm text-[#5a8f00] ">
              After verifying your email, you can{" "}
              <Link
                href="/login"
                className="font-semibold underline transition-all duration-200 cursor-pointer"
                style={{ color: "#76B900" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#5a8f00";
                  e.currentTarget.style.textDecorationColor = "#5a8f00";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#76B900";
                  e.currentTarget.style.textDecorationColor = "#76B900";
                }}
              >
                Log in here
              </Link>
            </p>

            {/* <Link
              href="/login"
              className="inline-block w-full text-center bg-[#76B900] hover:bg-[#5e9900] text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Go to Login
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
