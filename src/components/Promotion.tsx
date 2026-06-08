export default function Promotion() {
  return (
    <section className="bg-[url('/images/clow-clips.avif')] bg-cover bg-center py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl max-w-3xl">
          <h3 className="text-3xl font-extrabold">Summer Sale — Up to 40% off</h3>
          <p className="mt-3 text-muted">Selected home essentials and accessories at special prices. Limited time only.</p>
          <div className="mt-6 flex items-center gap-3">
            <a href="/products" className="btn btn-primary">Shop Sale</a>
            <a href="/products" className="btn btn-ghost">Explore all products</a>
          </div>
        </div>
      </div>
    </section>
  );
}
