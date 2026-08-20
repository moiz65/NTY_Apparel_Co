import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "BUILT FOR\nNATURALS",
    desc: "Earned. Not Injected. No Shortcuts. No Compromises.",
  },
  {
    number: "02",
    title: "REJECT\nTHE FAKE",
    desc: "No Illusions. No Lies. Just Real Progress.",
  },
  {
    number: "03",
    title: "PREMIUM\nCRAFT",
    desc: "Built to Perform. Built to Last. No Shortcuts Here Either.",
  },
];

const WhyNTYSection = () => {
  return (
    <section className="relative py-28 md:py-44 px-6 md:px-12 overflow-hidden">
      {/* Inverted colors — white bg, black text */}
      <div className="absolute inset-0 bg-background" />

      {/* Giant watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-heading text-[18rem] md:text-[30rem] text-foreground/[0.04] leading-none tracking-wider select-none">
          NTY
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 md:mb-28"
        >
          <p className="font-body text-[10px] tracking-[0.5em] uppercase text-foreground/40 mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-foreground/40 inline-block" />
            The Difference
          </p>
          <h2 className="font-heading text-6xl md:text-8xl lg:text-9xl tracking-wider text-foreground leading-[0.85]">
            WHY NATTY?
          </h2>
        </motion.div>

        <div className="space-y-0">
          {pillars.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-12 gap-4 md:gap-0 border-t border-foreground/10 py-10 md:py-16 cursor-default"
            >
              {/* Number */}
              <div className="col-span-2 md:col-span-1">
                <span className="font-heading text-5xl md:text-7xl text-foreground/10 group-hover:text-foreground/30 transition-colors duration-500 leading-none">
                  {item.number}
                </span>
              </div>

              {/* Title */}
              <div className="col-span-10 md:col-span-5 flex items-center">
                <h3 className="font-heading text-3xl md:text-5xl lg:text-6xl tracking-wider text-foreground leading-[0.9] whitespace-pre-line">
                  {item.title}
                </h3>
              </div>

              {/* Spacer */}
              <div className="hidden md:block md:col-span-2" />

              {/* Description */}
              <div className="col-span-12 md:col-span-4 flex items-center mt-4 md:mt-0">
                <p className="font-body text-sm md:text-base text-foreground/50 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
          {/* Bottom border */}
          <div className="border-t border-foreground/10" />
        </div>
      </div>
    </section>
  );
};

export default WhyNTYSection;
