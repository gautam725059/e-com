import Link from "next/link";
import { ArrowRight } from "lucide-react";

const POSTS = [
  {
    tag: "Design Tips",
    title: "5 Ways to Refresh Your Living Space",
    desc: "Quick ideas to transform your home without spending a fortune on renovations or new furniture.",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
  },
  {
    tag: "Hair Care",
    title: "Best Hair Accessories for Every Season",
    desc: "Keep your hair stylish and manageable all year round with these carefully picked accessories.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  },
  {
    tag: "Kitchen",
    title: "Must-Have Kitchen Tools for Every Home",
    desc: "Upgrade your cooking game with these essential tools every Indian kitchen needs.",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  },
];

export default function BlogSection() {
  return (
    <section className="sec" style={{ background: "var(--white)" }}>
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
