// utils/useAuthMonitor.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from "jwt-decode";

export const useAuthMonitor = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Function to check access token validity
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("JWT_Token");
      const expiresAt = localStorage.getItem("accessTokenExpiresAt");
      const refreshToken = localStorage.getItem("refreshToken");
      const tokenExpiry = localStorage.getItem("JWT_Expiry");

      if (!accessToken || accessToken === null || Date.now() > Number(tokenExpiry)) {
        console.log("No token found, redirecting to login");
          // Clear everything related to auth
  localStorage.removeItem("JWT_Token");
  localStorage.removeItem("JWT_Expiry");
  localStorage.removeItem("userRole");
        router.push("/login");
        return;
      }

      const now = Date.now();
      const expiry = Number(expiresAt);

      // 2. Token expired -> try refresh
      // if (now >= expiry) {
      //   console.log("Access token expired. Attempting refresh...");
      //   const success = await attemptRefresh(refreshToken);

      //   if (!success) {
      //     console.log("Refresh failed. Redirecting to login.");
      //     router.push("/login");
      //   }
      // }
    };

    // 3. Function to hit backend refresh API
    const attemptRefresh = async (refreshToken: string | null) => {
      try {
        if (!refreshToken) return false;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) return false;

        const data = await res.json();

        // save new tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("accessTokenExpiresAt", (Date.now() + 20 * 60 * 1000).toString());

        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        return true;
      } catch (e) {
        console.log("Refresh token request error", e);
        return false;
      }
    };

    // 4. Run immediately
    checkAuth();

    // 5. Check every 1 minute (better than 5 mins)
    const interval = setInterval(checkAuth, 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);
};
