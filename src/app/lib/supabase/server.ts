import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client.
 * Note: Using `@supabase/supabase-js` directly on the server will NOT
 * automatically manage cookies for you. If you want automatic auth cookie
 * handling, prefer `@supabase/ssr`. With this setup, have your server actions
 * read the returned session and set cookies explicitly if needed.
 */
export function supabaseServer() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }
    )
}
