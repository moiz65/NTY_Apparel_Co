import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { products } from "@/data/products";
import { useBenchClubMembership } from "@/hooks/useBenchClubMembership";

const featured = ["founders-t-shirt", "sleeveless-crewneck", "muscle-fit-shorts", "bench-club-patches"]
  .map((slug) => products.find((p) => p.slug === slug)!)
  .filter(Boolean);

const BestSellers = () => {
  const { isMember } = useBenchClubMembership();
  return (
    <section id="shop" className="bg-background py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-foreground text-center mb-16">
          REP 1 COLLECTION
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => {
            const locked = !!product.membersOnly && !isMember;
            const to = locked ? "/bench-club" : `/product/${product.slug}`;
            return (
              <Link
                key={product.slug}
                to={to}
                className="group block"
              >
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
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <Link
            to="/shop"
            className="inline-block border border-foreground text-foreground font-body text-sm tracking-[0.2em] uppercase px-10 py-4 hover:bg-foreground hover:text-background transition-colors duration-200"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
