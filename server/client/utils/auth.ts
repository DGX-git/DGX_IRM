import { jwtDecode } from "jwt-decode";

interface MyJwtPayload {
  exp: number;
  email: string;
  role: string;
}

export async function checkAuth(
  allowedRoles: string[]
): Promise<{ authorized: boolean; redirect?: string }> {
  try {
    // -------------------------------------
    // 1️⃣ Fast Local Check (role cache)
    // -------------------------------------
    const cachedRole = localStorage.getItem("userRole");

    if (cachedRole) {
      if (allowedRoles.includes(cachedRole)) {
        return { authorized: true };
      } else {
        return { authorized: false, redirect: roleRedirect(cachedRole) };
      }
    }

    // -------------------------------------
    // 2️⃣ Validate JWT locally
    // -------------------------------------
    const JWT_Token = localStorage.getItem("JWT_Token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!JWT_Token) {
      return { authorized: false, redirect: "/login" };
    }

    let decoded: MyJwtPayload;
    try {
      decoded = jwtDecode<MyJwtPayload>(JWT_Token);
    } catch (e) {
      return { authorized: false, redirect: "/login" };
    }

    const now = Math.floor(Date.now() / 1000);

    // -------------------------------------
    // 3️⃣ Token expired → attempt refresh
    // -------------------------------------
    if (decoded.exp <= now) {
      const refreshed = await attemptRefresh(refreshToken);
      if (!refreshed) {
        return { authorized: false, redirect: "/login" };
      }

      // decode the new token
      const newToken = localStorage.getItem("JWT_Token");
      decoded = jwtDecode<MyJwtPayload>(newToken!);
    }

    const roleName = decoded.role;
    const email = decoded.email;

    // Cache role & email
    localStorage.setItem("userRole", roleName);
    localStorage.setItem("userEmail", email);

    // -------------------------------------
    // 4️⃣ Check allowed roles
    // -------------------------------------
    if (allowedRoles.includes(roleName)) {
      return { authorized: true };
    }

    return { authorized: false, redirect: roleRedirect(roleName) };
  } catch (err) {
    console.error("Auth check failed:", err);
    return { authorized: false, redirect: "/login" };
  }
}

// Redirect logic for roles
function roleRedirect(roleName: string) {
  const redirectMap: Record<string, string> = {
    User: "/user",
    "Functional Admin": "/functionaladmin",
    "Technical Admin": "/technicaladmin",
  };
  return redirectMap[roleName] || "/login";
}

// REFRESH TOKEN
async function attemptRefresh(refreshToken: string | null) {
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();

    // Save new JWT token (your backend returns accessToken)
    localStorage.setItem("JWT_Token", data.accessToken);

    // Save new refreshToken if provided
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return true;
  } catch (err) {
    console.log("Refresh failed:", err);
    return false;
  }
}
