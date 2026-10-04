"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchPosts, createPost } from "@/features/posts/postSlice";
import { logout } from "@/features/auth/authSlice";
import Link from "next/link";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { posts, status } = useAppSelector((state) => state.posts);
  const { user, token } = useAppSelector((state) => state.auth);

  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !title.trim() || !content.trim()) return;

    const resultAction = await dispatch(createPost({ title, content, token }));

    if (createPost.fulfilled.match(resultAction)) {
      setTitle("");
      setContent("");
      dispatch(fetchPosts());
    }
  };

  // Jika belum mounted di client, jangan render apa pun untuk menghindari mismatch HTML
  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      {/* Header / Navbar Sederhana */}
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-indigo-600">PABWE Post App</h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Halo, {user.name}</span>
              <button
                onClick={() => dispatch(logout())}
                className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Form Buat Post (Hanya tampil jika sudah login) */}
      {user && token && (
        <form onSubmit={handleSubmitPost} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Buat Postingan Baru</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="Judul postingan..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="Tulis sesuatu..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
          >
            Kirim Postingan
          </button>
        </form>
      )}

      {/* Daftar Postingan */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Daftar Postingan</h2>
        {status === "loading" && <p className="text-gray-500">Memuat postingan...</p>}
        {posts.length === 0 && status === "succeeded" && (
          <p className="text-gray-500 bg-white p-4 rounded-xl border">Belum ada postingan.</p>
        )}
        <div className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-2">
              <h3 className="text-lg font-semibold text-indigo-900">{post.title}</h3>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{post.content}</p>
              <div className="text-xs text-gray-400 pt-2 border-t flex justify-between">
                <span>Oleh: {post.user?.name || "Anonim"}</span>
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString("id-ID") : ""}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}