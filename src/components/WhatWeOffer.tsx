export default function WhatWeOffer() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-2xl font-bold mb-4">What Shanya Offers</h2>
        <p className="text-gray-600">Fast delivery, easy returns, and quality assurance on every purchase.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
            <svg className="h-10 w-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.2 5.6A2 2 0 008 21h8a2 2 0 001.8-2.4L17 13"/></svg>
            <div className="mt-4 font-semibold">Free Shipping</div>
            <div className="text-sm muted mt-2">On orders over $50</div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
            <svg className="h-10 w-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 8a6 6 0 11-12 0 6 6 0 0112 0zM2 20a10 10 0 0120 0"/></svg>
            <div className="mt-4 font-semibold">24/7 Support</div>
            <div className="text-sm muted mt-2">Help whenever you need it</div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
            <svg className="h-10 w-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11v2h12v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3"/></svg>
            <div className="mt-4 font-semibold">Secure Payments</div>
            <div className="text-sm muted mt-2">Encrypted and trusted providers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
