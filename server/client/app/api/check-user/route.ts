// import { createClient } from "@supabase/supabase-js";

// export async function POST(req: { json: () => PromiseLike<{ email: any; }> | { email: any; }; }) {
//   const { email } = await req.json();

//   const supabaseAdmin = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SECRET_KEY!
//   );

//   const { data } = await supabaseAdmin.auth.admin.listUsers();
//   const user = data.users.find((u) => u.email === email);

//   console.log("User", user);

//   if (!user) {
//     return Response.json({ exists: false });
//   }

//   const confirmed = Boolean(user.email_confirmed_at);

//   return Response.json({
//     exists: true,
//     confirmed,
//     status: confirmed ? "confirmed" : "pending",
//   });
// }
