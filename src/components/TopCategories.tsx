import imageMap from '@/data/imageMap';

export default function TopCategories() {
  const categories = [
    { key: 'Adhesive Hooks', img: 'wall-hooks.avif' },
    { key: 'Hair Accessories', img: 'clow-clips.avif' },
    { key: 'Bathroom Accessories', img: 'bathroom.avif' },
    { key: 'Kitchen Accessories', img: 'knife-set.avif' },
    { key: 'Key chain', img: 'key-ring.avif' },
    { key: 'Birthday Decorations', img: 'decoration-kit.jpg' },
  ];

  return (
    <section id="TopCategories" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Top Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((c, i) => (
          <div key={i} className="card p-4 text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto shadow-sm">
              <img src={imageMap[c.img] ?? `/images/${c.img}`} alt={c.key} className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 text-sm font-medium">{c.key}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
