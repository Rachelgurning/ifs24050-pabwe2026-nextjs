"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { loginUser } from "@/features/auth/authSlice";
import { useInput } from "@/hooks/useInput";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.auth);

  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        setValidationError(err || "Gagal melakukan login.");
      });
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h1>
        <p className="text-sm text-gray-500">Silakan masukkan email dan kata sandi Anda</p>
      </div>

      {(validationError || error) && (
        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-100">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="nama@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
          <input
            type="password"
            value={password}
            onChange={onPasswordChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm disabled:opacity-50"
        >
          {status === "loading" ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-500 pt-2 border-t">
        <Link href="/" className="text-indigo-600 hover:underline font-medium">
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}