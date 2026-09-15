import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";

import { WaxSealScreen } from "./components/WaxSealScreen";
import { IntroLetter } from "./components/IntroLetter";
import { Gallery } from "./components/Gallery";
import { ProudOf } from "./components/ProudOf";
import { MainLetter } from "./components/MainLetter";
import { Ending } from "./components/Ending";
import { AdminDashboard } from "./components/AdminDashboard";

type AuthStatus = {
  authenticated: boolean;
  isAdmin: boolean;
  email?: string;
  displayName?: string;
};

function App() {
  const [opened, setOpened] = useState(false);
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isAdminPath =
    window.location.pathname.replace(/\/+$/, "") === "/admin/visitors";

  const hasAdminAccess =
    isAdminPath && auth?.authenticated === true && auth.isAdmin === true;
  const contentVisible = isAdminPath ? hasAdminAccess : opened;

  const authError = new URLSearchParams(window.location.search).get(
    "authError",
  );

  const startGoogleLogin = () => {
    const returnTo = `${window.location.pathname}${window.location.search
      .replace(/([?&])authError=[^&]*/, "")
      .replace(/[?&]$/, "")}`;

    window.location.assign(
      `/api/auth/google/login?returnTo=${encodeURIComponent(returnTo || "/")}`,
    );
  };

  useEffect(() => {
    let active = true;

    const finishAuthentication = async () => {
      try {
        /*
         * Supabase returns the Google session in the URL hash:
         * #access_token=...
         *
         * Send that access token to our API so the API can create
         * the normal birthday_session cookie.
         */
        const hash = window.location.hash;

        if (hash.includes("access_token=")) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");

          if (accessToken) {
            try {
              const sessionResponse = await fetch("/api/auth/session", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  access_token: accessToken,
                }),
              });

              if (sessionResponse.ok) {
                /*
                 * Remove the Supabase access token from the browser URL.
                 */
                window.history.replaceState(
                  {},
                  document.title,
                  window.location.pathname + window.location.search,
                );
              }
            } catch {
              // Continue to the normal authentication check.
            }
          }
        }

        /*
         * Now ask our API whether the visitor has an authenticated
         * birthday-session cookie.
         */
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Auth status unavailable");
        }

        const data: AuthStatus = await response.json();

        if (!active) return;

        setAuth(data);

        if (data.authenticated && !isAdminPath) {
          setOpened(true);
        }
      } catch {
        if (active) {
          setAuth({
            authenticated: false,
            isAdmin: false,
          });
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    finishAuthentication();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (
      !authLoading &&
      isAdminPath &&
      !hasAdminAccess
    ) {
      window.location.replace("/");
    }
  }, [authLoading, hasAdminAccess, isAdminPath]);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setAuth({
      authenticated: false,
      isAdmin: false,
    });

    setOpened(false);
  };

  return (
    /* Page background — warm cream with soft peach/rose blushes */
    <div
      className="min-h-[100dvh] relative overflow-x-hidden"
      style={{
        backgroundColor: "#FFF9F3",
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 10% 15%, rgba(248,220,200,0.45) 0%, transparent 60%),
          radial-gradient(ellipse 50% 35% at 90% 75%, rgba(217,165,165,0.25) 0%, transparent 55%),
          radial-gradient(ellipse 70% 60% at 50% 50%, rgba(244,233,221,0.3) 0%, transparent 70%)
        `,
      }}
    >
      {/* Wax seal opening screen — sits on top until opened */}
      <AnimatePresence>
        {!authLoading && !opened && !isAdminPath && (
          <WaxSealScreen
            key="seal"
            onGoogleLogin={startGoogleLogin}
            authError={authError}
          />
        )}
      </AnimatePresence>

      {/* Main content — fades in after opening */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        style={{
          pointerEvents: contentVisible ? "auto" : "none",
        }}
        className="relative z-10 w-full"
      >
        {hasAdminAccess ? (
          <AdminDashboard />
        ) : (
          <>
            {auth?.authenticated && (
              <div className="fixed top-4 right-4 z-20 flex items-center gap-3">
                {auth.isAdmin && (
                  <a
                    href="/admin/visitors"
                    className="rounded-full px-3 py-2"
                    style={{
                      backgroundColor: "rgba(255, 252, 248, 0.9)",
                      border: "1px solid rgba(184, 92, 92, 0.25)",
                      color: "#9E3A3A",
                      fontFamily: '"Crimson Pro", serif',
                      fontSize: "0.95rem",
                    }}
                  >
                    Visitors
                  </a>
                )}

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full px-3 py-2"
                  style={{
                    backgroundColor: "rgba(255, 252, 248, 0.9)",
                    border: "1px solid rgba(184, 92, 92, 0.25)",
                    color: "#9E3A3A",
                    fontFamily: '"Crimson Pro", serif',
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  Sign out
                </button>
              </div>
            )}

            <IntroLetter />
            <Gallery />
            <ProudOf />
            <MainLetter />
            <Ending />
          </>
        )}
      </motion.main>
    </div>
  );
}

export default App;
