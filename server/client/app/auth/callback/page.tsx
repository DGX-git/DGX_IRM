// "use client";

// import { useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { useRouter } from "next/navigation";

// export default function AuthCallback() {
//   const router = useRouter();

//   useEffect(() => {
//     const handleEmailConfirmation = async () => {
//     //  Fetch logged-in user
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
   
//     return;
//   }

//   //  Prepare metadata to insert into your DB table
//   const meta = user.user_metadata?.formData; // your form data saved earlier
 
  
//   //  INSERT into users table
//   const { data: createdUser, error: userInsertError } = await supabase
//     .from("dgx_user")
//     .insert({
//       // auth_user_id: user.id,
//       first_name: meta.firstName,
//       last_name: meta.lastName,
//       email_id: meta.email,
//       contact_no: meta.phoneNumber,
//       role_id: meta.role,
//       // created_at: new Date(),
//     })
//     .select()
//     .single();

//   if (userInsertError) {
//     console.error("Insert user table error:", userInsertError);
   
//     return;
//   }


//   // 4️⃣ INSERT into userInstituteAssociation table
//   const { error: assocInsertError } = await supabase
//     .from("user_institute_association")
//     .insert({
//       user_id: createdUser.user_id,                     // 👈 DB user table ID
//       institute_id: meta.institute,                // from formData
//       department_id: meta.department,              // from formData
//       is_reg_institute: true,
//       created_by: createdUser.id,
//     });

//   if (assocInsertError) {
//     console.error("Insert userInstituteAssociation error:", assocInsertError);
  
//     return;
//   }

//       // 4️⃣ Redirect user to login or dashboard
//       router.push("/login?verified=1");
//     };

//     handleEmailConfirmation();
//   }, []);


// }
