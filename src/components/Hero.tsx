export default function Hero() {
  return (
    <section id="home" className="w-full px-4 py-12 bg-gradient-to-b from-white to-navy-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="text-center lg:text-left">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-gold-600 mb-3">Premium Home &amp; Lifestyle</h2>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-700 mb-4">Make your home beautiful with curated products</h1>
          <p className="text-gray-600 mb-6 max-w-xl">Shop thoughtfully selected homeware, kitchen tools and accessories built for daily life. Free shipping on orders over ₹1000.</p>

          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <button className="bg-navy-700 hover:bg-navy-800 text-white px-6 py-3 rounded-lg font-medium transition">Shop Collections</button>
            <button className="bg-white border border-navy-200 text-navy-700 hover:border-gold-500 hover:text-gold-600 px-5 py-3 rounded-lg transition">Explore Products</button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0">
            <div className="text-center">
              <div className="text-lg font-semibold">100k+</div>
              <div className="text-sm text-gray-500">Happy customers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Free</div>
              <div className="text-sm text-gray-500">Shipping over ₹1000</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">30 days</div>
              <div className="text-sm text-gray-500">Easy returns</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img src="/images/knife-set.avif" alt="Featured" className="w-80 h-80 object-cover rounded-xl shadow-lg" />
        </div>
      </div>
    </section>
  );
}