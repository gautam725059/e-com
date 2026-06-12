export default function LatestBlog() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-2xl font-bold text-center mb-6">Latest Blog</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <article key={i} className="card overflow-hidden">
              <img src={`https://source.unsplash.com/600x300/?interior,home,${i}`} className="w-full h-44 object-cover" />
              <div className="p-4">
                <h4 className="font-semibold">Design Tips {i}</h4>
                <p className="text-sm muted mt-2">Quick ideas to refresh your living space.</p>
                <div className="mt-4">
                  <a href="#" className="text-sm text-navy-700 font-medium">Read more</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
