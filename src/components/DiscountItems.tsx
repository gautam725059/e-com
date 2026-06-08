export default function DiscountItems() {
  const promos = [
    { title: 'Knife set - 30% off', desc: 'Comfortable and stylish seating.' },
    { title: 'Clow Clip - 20% off', desc: 'Brighten your space with warm light.' },
    { title: 'Decoration Kit - 40% off', desc: 'Add texture and color to floors.' },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-2xl font-bold text-center">Discount Items</h3>
        <p className="mt-3 muted text-center">Up to 50% off selected products.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {promos.map((p, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="text-lg font-semibold">{p.title}</div>
              <div className="text-sm muted mt-2">{p.desc}</div>
              <div className="mt-4">
                <a href="/products" className="btn btn-primary">Shop</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
