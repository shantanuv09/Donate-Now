"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken, getRefreshToken, setAuthToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  exp: number; // Expiration timestamp
}

export default function withAuth(WrappedComponent: React.ComponentType) {
  return function WithAuthWrapper(props: any) {
    const router = useRouter();
    const pathname = usePathname();
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const warningSet = new Set<number>(); // Keeps track of already shown pop-ups

    useEffect(() => {
      const initializeAuth = () => {
        const token = getAuthToken();
        if (!token) {
          router.replace("/login");
          return;
        }

        try {
          const decoded: DecodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          const remainingTime = decoded.exp - currentTime;

          // Redirect based on role
          if (decoded.role === "admin" && pathname === "/dashboard") {
            router.replace("/admin");
          } else if (decoded.role !== "admin" && pathname === "/admin") {
            router.replace("/dashboard");
          } else {
            setAuthenticated(true);
          }

          setTimeLeft(remainingTime);

          if (intervalId) clearInterval(intervalId);

          const newInterval = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev === null) return null;
              const newTimeLeft = prev - 1;

              // Show pop-up only if it hasn’t been shown before
              if ([180, 120, 60].includes(newTimeLeft) && !warningSet.has(newTimeLeft)) {
                warningSet.add(newTimeLeft); // Mark warning as shown
                handleSessionExpirationWarning(newTimeLeft);
              }

              if (newTimeLeft <= 0) {
                clearInterval(newInterval);
                router.replace("/login");
              }

              return newTimeLeft;
            });
          }, 1000);

          setIntervalId(newInterval);
        } catch (error) {
          console.error("Invalid token:", error);
          sessionStorage.removeItem("accessToken");
          router.replace("/login");
        }
      };

      initializeAuth();
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [router, pathname]);

    const handleSessionExpirationWarning = async (timeRemaining: number) => {
      const shouldRefresh = window.confirm(
        `Your session is about to expire in ${timeRemaining / 60} minute(s). Do you want to refresh your session?`
      );
      if (shouldRefresh) {
        await handleRefreshToken();
      }
    };

    const handleRefreshToken = async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const jsonResponse = await response.json();
          setAuthToken(jsonResponse.accessToken);

          // Reset timer after refresh
          const decoded: DecodedToken = jwtDecode(jsonResponse.accessToken);
          const currentTime = Math.floor(Date.now() / 1000);
          const newRemainingTime = decoded.exp - currentTime;

          setTimeLeft(newRemainingTime);
          warningSet.clear(); // Reset warnings to prevent duplicates

          if (intervalId) clearInterval(intervalId);
          const newInterval = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev === null) return null;
              const newTimeLeft = prev - 1;

              if ([180, 120, 60].includes(newTimeLeft) && !warningSet.has(newTimeLeft)) {
                warningSet.add(newTimeLeft);
                handleSessionExpirationWarning(newTimeLeft);
              }

              if (newTimeLeft <= 0) {
                clearInterval(newInterval);
                router.replace("/login");
              }

              return newTimeLeft;
            });
          }, 1000);

          setIntervalId(newInterval);
        } catch (error) {
          console.error("Error refreshing token:", error);
          router.replace("/login");
        }
      } else {
        router.replace("/login");
      }
    };

    if (authenticated === null) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
