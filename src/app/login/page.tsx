"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mobile.length !== 10) {
      alert("Please enter a valid mobile number");
      return;
    }

    localStorage.setItem(
      "userLoggedIn",
      "true"
    );

    localStorage.setItem(
      "userMobile",
      mobile
    );

    alert("Login Successful");

    router.push("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome to Shanya
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login using your mobile number
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

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
                onChange={(e) =>
                  setMobile(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
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
          OTP login will be added in the next step.
        </p>

      </div>
    </main>
  );
}