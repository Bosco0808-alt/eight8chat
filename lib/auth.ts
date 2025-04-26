/// auth.ts

import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";

// *DO NOT* create a `Pool` here, outside the request handler.

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: NeonAdapter(pool),
    providers: [
      Resend({
        from: "eight8chat.com",
        apiKey: process.env.AUTH_RESEND_KEY,
      }),
    ],
  };
});
