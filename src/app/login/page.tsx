"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("userMobile", mobile);
    if (name.trim()) localStorage.setItem("userName", name.trim());

    toast.success("Welcome to Shanya!");

    // Return the user to wherever they were headed (cart / checkout / etc.)
    const redirect =
      new URLSearchParams(window.location.search).get("redirect") || "/";
    router.replace(redirect);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <Link href="/" className="block text-center text-sm text-gray-400 mb-6 hover:text-gold-500">
          ← Back to store
        </Link>

        <h1 className="text-3xl font-bold text-center mb-2">
          Login / Register
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Continue with your mobile number
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Name <span className="text-gray-400 font-normal">(for new users)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mobile Number
            </label>

            <div className="flex">
              <span className="px-4 py-3 bg-gray-100 border border-r-0 rounded-l-lg">
                +91
              </span>

              <input
                type="tel"
                maxLength={10}
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className="w-full border rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-navy-700 hover:bg-navy-800 text-white py-3 rounded-lg font-medium"
          >
            Continue
          </button>

        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          New here? Just enter your details — your account is created automatically.
        </p>

      </div>
    </main>
  );
}
