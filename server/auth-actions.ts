"use server";

import { signIn } from "@/server/auth";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginState =
  | {
      error?: string;
    }
  | undefined
  | null;

export async function loginAction(prevState: LoginState, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/posts", 
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau Password salah!" };
        default:
          return { error: "Terjadi kesalahan sistem." };
      }
    }
    throw error; 
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("authjs.session-token");
  cookieStore.delete("authjs.csrf-token");
  cookieStore.delete("authjs.callback-url");
  redirect("/");
}
