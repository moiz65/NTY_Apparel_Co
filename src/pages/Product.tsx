import { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrgencyBanner from "@/components/UrgencyBanner";
import { getProductBySlug, products } from "@/data/products";
import { toast } from "sonner";
import { useBenchClubMembership } from "@/hooks/useBenchClubMembership";

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = useMemo(() => (slug ? getProductBySlug(slug) : undefined), [slug]);
  const [colorIdx, setColorIdx] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const { isMember, loading: memberLoading } = useBenchClubMembership();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!product) return <Navigate to="/shop" replace />;

  const locked = !!product.membersOnly && !isMember && !memberLoading;
  const soldOut = !!product.soldOut;
  const activeColor = product.colors?.[colorIdx];
  const gallery = activeColor?.gallery ?? product.gallery;

  const handleAdd = () => {
    if (soldOut) {
      toast.error("This item is currently sold out.");
      return;
    }

    if (locked) {
      toast.error("This product is reserved for verified Bench Club members.");
      return;
    }

    if (!size) {
      toast.error("Please select a size");
      return;
    }

    const colorLabel = activeColor ? ` · ${activeColor.name}` : "";
    toast.success(`${product.name}${colorLabel} (${size}) × ${qty} added to cart`);
  };

  const sameStyle = products.filter((p) => p.slug !== product.slug && p.style === product.style);
  const others = products.filter((p) => p.slug !== product.slug && p.style !== product.style);
  const related = [...sameStyle, ...others].slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <UrgencyBanner />
      <Header />

      <section className="px-6 md:px-12 pt-10 pb-6 max-w-7xl mx-auto">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to shop
        </Link>
      </section>

      <section className="px-6 md:px-12 pb-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <motion.div
              key={`${colorIdx}-${activeImage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square overflow-hidden border border-border bg-card"
            >
              <img
                src={gallery[activeImage] ?? gallery[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain p-8 md:p-12"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 bg-foreground text-background font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1">
                  {product.tag}
                </span>
              )}
            </motion.div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-square overflow-hidden border bg-card transition-colors ${
                      i === activeImage ? "border-foreground" : "border-border hover:border-foreground/60"
                    }`}
                  >
                    <img src={img} alt="" className="absolute inset-0 w-full h-full object-contain p-3" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-3">{product.style}</p>
            <h1 className="font-heading text-4xl md:text-6xl tracking-wider text-foreground">{product.name.toUpperCase()}</h1>
            <p className="font-body text-2xl text-foreground mt-3">
              {product.compareAtPrice && (
                <span className="text-muted-foreground line-through mr-3">${product.compareAtPrice}</span>
              )}
              <span>${product.price}</span>
            </p>

            <p className="font-body text-sm text-muted-foreground leading-relaxed mt-6">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-xs tracking-[0.2em] uppercase text-foreground">Color</span>
                  <span className="font-body text-xs text-muted-foreground">{product.colors[colorIdx].name}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setColorIdx(i);
                        setActiveImage(0);
                      }}
                      aria-label={c.name}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        i === colorIdx ? "border-foreground scale-110" : "border-border hover:border-foreground/60"
                      }`}
                      style={{ backgroundColor: c.swatch }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-xs tracking-[0.2em] uppercase text-foreground">Size</span>
                <span className="font-body text-xs text-muted-foreground">Size guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] px-4 py-3 font-body text-xs tracking-[0.15em] uppercase border transition-colors ${
                      size === s
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="inline-flex items-center border border-border self-start">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-2.5 py-2 text-foreground hover:bg-muted transition-colors"
                  aria-label="Decrease"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-body text-xs text-foreground w-7 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-2.5 py-2 text-foreground hover:bg-muted transition-colors"
                  aria-label="Increase"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={locked || soldOut}
                className={`group relative flex-1 inline-flex items-center justify-center gap-3 font-body text-sm tracking-[0.2em] uppercase px-10 py-4 overflow-hidden disabled:cursor-not-allowed ${
                  soldOut
                    ? "bg-muted text-muted-foreground border border-border"
                    : "bg-foreground text-background disabled:opacity-60"
                }`}
              >
                {!soldOut && (
                  <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                )}
                <span className="relative z-10 inline-flex items-center gap-2">
                  {locked && !soldOut && <Lock className="w-3.5 h-3.5" />}
                  {soldOut ? "Sold Out" : locked ? "Members Only" : "Add to cart"}
                </span>
              </button>
            </div>

            {locked && (
              <div className="mt-4 border border-gold/40 bg-gold/5 p-4 text-sm font-body text-foreground/80 leading-relaxed">
                <p className="flex items-center gap-2 mb-1 text-gold font-semibold uppercase text-xs tracking-[0.2em]">
                  <Lock className="w-3 h-3" /> Members Only
                </p>
                Reserved for verified Bench Club members. <Link to="/bench-club" className="underline underline-offset-4 text-foreground">Register your bench</Link> to unlock.
              </div>
            )}

            <div className="mt-10 border-t border-border pt-6">
              <h3 className="font-body text-xs tracking-[0.2em] uppercase text-foreground mb-4">Details</h3>
              <ul className="space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="font-body text-sm text-muted-foreground flex gap-3">
                    <span className="text-foreground/40">—</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              {(product as any).fitNote && (
                <p className="mt-4 font-body text-sm italic text-muted-foreground">{(product as any).fitNote}</p>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-6 font-body text-xs text-muted-foreground leading-relaxed">
              Free shipping on orders over $75 · 30-day returns · Questions? <a href="mailto:support@ntyapparel.com" className="text-foreground underline underline-offset-4">support@ntyapparel.com</a>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl tracking-wider text-foreground mb-8">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => {
              const lockedProduct = !!p.membersOnly && !isMember && !memberLoading;
              const to = lockedProduct ? "/bench-club" : `/product/${p.slug}`;

              return (
                <Link key={p.slug} to={to} className="group block">
                  <div className="relative aspect-square overflow-hidden border border-border bg-background mb-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${
                        lockedProduct ? "blur-sm scale-105 opacity-60" : "group-hover:scale-105"
                      }`}
                    />
                    {lockedProduct && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/40 backdrop-blur-[2px] text-background text-center px-4">
                        <Lock className="w-8 h-8 mb-3" />
                        <p className="font-body text-[10px] tracking-[0.25em] uppercase">Members Only</p>
                      </div>
                    )}
                    {p.tag && (
                      <span className="absolute top-3 left-3 bg-foreground text-background font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-body text-sm tracking-[0.1em] uppercase text-foreground flex items-center gap-2">
                    {p.name}
                    {lockedProduct && <Lock className="w-3 h-3 text-muted-foreground" />}
                  </h3>
                  {!lockedProduct && (
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {p.compareAtPrice && <span className="line-through mr-2">${p.compareAtPrice}</span>}
                      <span className={p.compareAtPrice ? "text-foreground" : ""}>${p.price}</span>
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Product;
