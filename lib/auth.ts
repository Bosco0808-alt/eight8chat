/// auth.ts

import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";
import GitHub from "next-auth/providers/github";

// *DO NOT* create a `Pool` here, outside the request handler.

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: NeonAdapter(pool),
    providers: [
      Resend({
        from: "no-reply@eight8chat.com",
        apiKey: process.env.AUTH_RESEND_KEY,
      }),
      GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
  };
});
