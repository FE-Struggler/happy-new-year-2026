
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseSecretKey!,
    {
      cookies: {
        getAll() {
          // @ts-expect-error - cookieStore type mismatch in server.ts but runtime is correct
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            // @ts-expect-error - cookieStore type mismatch in server.ts but runtime is correct
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
