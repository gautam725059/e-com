"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    platform: "",
    productName: "",
    description: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      console.log({
        ...formData,
        image,
      });

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      alert("Product submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        platform: "",
        productName: "",
        description: "",
      });

      setImage(null);
      setPreview("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-3xl font-bold text-center">
          Contact Us
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2 mb-6">
          Submit your product details and we'll get back to you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full mt-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full mt-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Phone + Marketplace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full mt-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Marketplace
              </label>

              <select
                name="platform"
                required
                value={formData.platform}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">
                  Select Marketplace
                </option>
                <option value="Amazon">
                  Amazon
                </option>
                <option value="Blinkit">
                  Blinkit
                </option>
                <option value="Shopify">
                  Shopify
                </option>
                <option value="Flipkart">
                  Flipkart
                </option>
              </select>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="text-sm font-medium">
              Product Name
            </label>

            <input
              type="text"
              name="productName"
              required
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full mt-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="text-sm font-medium">
              Product Description
            </label>

            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              className="w-full mt-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Product Image */}
          <div>
            <label className="text-sm font-medium">
              Upload Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (file) {
                  setImage(file);
                  setPreview(
                    URL.createObjectURL(file)
                  );
                }
              }}
              className="w-full mt-1 border rounded-lg px-3 py-2.5 text-sm"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 h-32 w-full object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : "Submit Product"}
          </button>
        </form>
      </div>
    </section>
  );
}