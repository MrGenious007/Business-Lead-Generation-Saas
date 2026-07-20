import { NextAuthOptions } from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const nextAuthOptions: NextAuthOptions = {
  adapter: SupabaseAdapter(supabase),
  providers: [
    // Add your authentication providers here
  ],
  pages: {
    signIn: '/auth/signin',
    // Add other custom pages if needed
  },
  callbacks: {
    async session({ session, token }) {
      // Add custom session handling if needed
      return session;
    },
    async jwt({ token, user }) {
      // Add custom JWT handling if needed
      return token;
    },
  },
  // Add other NextAuth options as needed
};

export default nextAuthOptions;