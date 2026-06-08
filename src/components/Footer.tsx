"use client";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold">Shanya</h3>
          <p className="text-gray-300 mt-3">Quality home furniture & decor delivered to your door.</p>
          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="facebook" className="text-gray-300 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898v-2.888h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" aria-label="instagram" className="text-gray-300 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zm6.5-.75a1.125 1.125 0 1 1-1.125-1.125A1.125 1.125 0 0 1 18.5 7.75z"/>
              </svg>
            </a>
            <a href="#" aria-label="twitter" className="text-gray-300 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 5.924c-.66.293-1.37.49-2.11.58a3.7 3.7 0 0 0 1.62-2.04 7.39 7.39 0 0 1-2.35.9A3.68 3.68 0 0 0 12.15 8c0 .29.03.57.1.84A10.46 10.46 0 0 1 3.16 5.1a3.68 3.68 0 0 0 1.14 4.9c-.57-.02-1.1-.18-1.57-.43v.04c0 1.8 1.28 3.3 2.98 3.64-.5.14-1.02.17-1.56.06.44 1.36 1.72 2.34 3.23 2.37A7.38 7.38 0 0 1 2 19.54a10.42 10.42 0 0 0 5.64 1.65c6.77 0 10.48-5.61 10.48-10.48v-.48A7.28 7.28 0 0 0 22 5.92z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-gray-300">
            <li><a href="/products" className="hover:text-white">All Products</a></li>
            <li><a href="#" className="hover:text-white">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white">Best Sellers</a></li>
            <li><a href="#" className="hover:text-white">Sale</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Press</a></li>
            <li><a href="#" className="hover:text-white">Affiliates</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="text-gray-300 mt-3">support@shanya.com</p>
          <p className="text-gray-300">+1 (555) 123-4567</p>

          <form className="mt-4 flex gap-2" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Your email" className="px-3 py-2 rounded bg-white text-black flex-1" />
            <button className="bg-pink-500 text-white px-4 py-2 rounded">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-gray-400">
          <small>© 2026 Shanya. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
