// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt", 
  },
  pages: {
    signIn: "/login", // Halaman login kustom kita nanti
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Cari user di database Neon berdasarkan email
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const user = userResult[0];

        // Jika user tidak ada
        if (!user) {
          throw new Error("User tidak ditemukan.");
        }

        // Cek password (Hash comparison)
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new Error("Password salah.");
        }

        // Return user object (tanpa password)
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});