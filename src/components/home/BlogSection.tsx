import Link from "next/link";
import { ArrowRight } from "lucide-react";

const POSTS = [
  {
    tag: "Styling Tips",
    title: "5 Easy Claw Clip Hairstyles for Work",
    desc: "Quick, elegant updos you can create in under two minutes with just one claw clip.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  },
  {
    tag: "Hair Care",
    title: "Scrunchies vs Rubber Bands: What's Better?",
    desc: "Why switching to soft scrunchies and snag-free ties protects your hair from breakage.",
    img: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80",
  },
  {
    tag: "Trends",
    title: "Headband Looks Trending This Season",
    desc: "From knotted to pearl-embellished — the headband styles every girl is loving right now.",
    img: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80",
  },
];

export default function BlogSection() {
  return (
    <section className="sec" style={{ background: "var(--cream)" }}>
      <div className="sec-hd">
        <div>
          <div className="sec-ey">Tips &amp; Ideas</div>
          <div className="sec-ti">Latest Blog</div>
        </div>
        <Link href="/blogs" className="see-all">
          View All <ArrowRight size={15} />
        </Link>
      </div>

      <div className="blog-g">
        {POSTS.map((post) => (
          <Link href="/blogs" className="bc" key={post.title}>
            <div className="bc-img">
              <img src={post.img} alt={post.title} loading="lazy" />
            </div>
            <div className="bc-body">
              <div className="bc-tag">{post.tag}</div>
              <div className="bc-title">{post.title}</div>
              <div className="bc-sub">{post.desc}</div>
              <div className="bc-read">
                Read More <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
