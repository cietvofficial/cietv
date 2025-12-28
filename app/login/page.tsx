'use client';

import { useActionState } from "react";
import { loginAction } from "@/server/auth-actions"; 

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Login Admin CieTV
        </h1>

        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="example@gmail.com"
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="******"
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500 text-center">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending} // Disable tombol saat loading
            className={`w-full rounded py-2 font-semibold text-white transition ${
              isPending 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? "Sedang Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}