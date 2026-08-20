import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrgencyBanner from "@/components/UrgencyBanner";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Lock } from "lucide-react";
import { products } from "@/data/products";
import { useBenchClubMembership } from "@/hooks/useBenchClubMembership";


const styles = ["All", "Tops", "Bottoms", "Accessories"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $40", min: 0, max: 39.99 },
  { label: "$40 – $70", min: 40, max: 70 },
  { label: "Over $70", min: 70.01, max: Infinity },
];

const Shop = () => {
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { isMember } = useBenchClubMembership();

  const filtered = useMemo(() => {
    const range = priceRanges[selectedPriceIdx];
    return products.filter((p) => {
      const matchStyle = selectedStyle === "All" || p.style === selectedStyle;
      const matchPrice = p.price >= range.min && p.price <= range.max;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStyle && matchPrice && matchSearch;
    });
  }, [selectedStyle, selectedPriceIdx, searchQuery]);

  const hasFilters = selectedStyle !== "All" || selectedPriceIdx !== 0 || searchQuery !== "";

  const clearFilters = () => {
    setSelectedStyle("All");
    setSelectedPriceIdx(0);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <UrgencyBanner />
      <Header />

      <section className="pt-16 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-6xl md:text-8xl tracking-wider text-foreground mb-4">
            SHOP ALL
          </h1>
          <p className="font-body text-sm text-muted-foreground tracking-[0.15em] uppercase">
            Premium apparel for natural athletes
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-3 bg-muted border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mr-2">Style</span>
              <div className="flex flex-wrap gap-2">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStyle(s)}
                    className={`font-body text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors ${
                      selectedStyle === s
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mr-2">Price</span>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((r, i) => (
                  <button
                    key={r.label}
                    onClick={() => setSelectedPriceIdx(i)}
                    className={`font-body text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors ${
                      selectedPriceIdx === i
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-foreground"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="bg-background pb-20 md:pb-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-sm text-muted-foreground">No products match your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 font-body text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((product, i) => {
                const locked = !!product.membersOnly && !isMember;
                const CardInner = (
                  <>
                    <div className="relative aspect-square overflow-hidden border border-border bg-background mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${
                          locked ? "blur-sm scale-105 opacity-60" : "group-hover:scale-105"
                        }`}
                      />
                      {locked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/40 backdrop-blur-[2px] text-background text-center px-4">
                          <Lock className="w-8 h-8 mb-3" />
                          <p className="font-body text-[10px] tracking-[0.25em] uppercase">Members Only</p>
                          <p className="font-body text-[10px] text-background/70 mt-2 leading-relaxed max-w-[180px]">
                            Verify into the Bench Club to unlock
                          </p>
                        </div>
                      )}
                      {product.tag && (
                        <span className="absolute top-3 left-3 bg-foreground text-background font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1">
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="font-body text-sm tracking-[0.1em] uppercase text-foreground flex items-center gap-2">
                      {product.name}
                      {locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                    </h3>
                    {!locked && (
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        {product.compareAtPrice && <span className="line-through mr-2">${product.compareAtPrice}</span>}
                        <span className={product.compareAtPrice ? "text-foreground" : ""}>${product.price}</span>
                      </p>
                    )}
                  </>
                );

                return (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    {locked ? (
                      <Link to="/bench-club" className="group block cursor-not-allowed" aria-label={`${product.name} (members only)`}>
                        {CardInner}
                      </Link>
                    ) : (
                      <Link to={`/product/${product.slug}`} className="group block">
                        {CardInner}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;

