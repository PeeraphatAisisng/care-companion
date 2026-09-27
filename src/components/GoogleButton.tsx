"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleButton({ next = "/dashboard" }: { next?: string }) {
  async function signIn() {
    const supabase = createClient();
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <button type="button" onClick={signIn} className="btn btn-primary w-full text-lg">
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path
          fill="currentColor"
          d="M21.35 11.1h-9.18v2.96h5.3c-.23 1.5-1.77 4.4-5.3 4.4-3.19 0-5.8-2.64-5.8-5.9s2.61-5.9 5.8-5.9c1.82 0 3.04.77 3.74 1.44l2.55-2.46C16.54 3.7 14.46 2.8 12.17 2.8 6.98 2.8 2.8 6.98 2.8 12.17S6.98 21.54 12.17 21.54c7.03 0 9.35-4.9 9.35-7.4 0-.5-.05-.86-.17-1.04z"
        />
      </svg>
      เข้าสู่ระบบด้วย Google
    </button>
  );
}
