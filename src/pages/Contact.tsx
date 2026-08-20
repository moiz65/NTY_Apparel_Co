import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Search, Package, MessageSquare, HelpCircle, ChevronRight, CheckCircle2, ArrowDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const supportBenefits = [
  "Response within 24 hours",
  "Order tracking & updates",
  "Product recommendations",
  "Sizing & fit guidance",
];

const messageTips = [
  { icon: Package, title: "Order Number", desc: "Include your order number for faster assistance." },
  { icon: MessageSquare, title: "Product Details", desc: "Specify which product for accurate guidance." },
  { icon: HelpCircle, title: "Clear Question", desc: "Be specific about what you need help with." },
];

const faqs = [
  { q: "How quickly will I receive a response?", a: "Our support team typically responds within 24 hours during business days. During peak periods, it may take up to 48 hours." },
  { q: "How can I track my order?", a: "Once your order ships, you'll receive a confirmation email with tracking information. You can also email us with your order number for updates." },
  { q: "I received the wrong item or my order is damaged. What should I do?", a: "Email us immediately with your order number and photos of the issue. We'll arrange a replacement or refund as quickly as possible." },
  { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placement. After that, we may not be able to make changes as items enter fulfillment." },
  { q: "Do you offer exchanges?", a: "Yes! If you need a different size or color, email us within 30 days of delivery and we'll set up an exchange." },
  { q: "What is your return policy?", a: "We offer hassle-free returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging." },
  { q: "Do you ship internationally?", a: "Yes, we ship worldwide. International orders may take 7-14 business days depending on location." },
  { q: "My payment was declined. What should I do?", a: "Double-check your card details and try again. If the issue persists, try a different payment method or contact your bank." },
];

const SUPPORT_EMAIL = "support@ntyapparel.com";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative pt-6 pb-12 md:pt-10 md:pb-16 flex flex-col items-center justify-center px-6 md:px-12 bg-background">
        {/* Giant watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-heading text-[20rem] md:text-[36rem] text-foreground/[0.03] leading-none tracking-wider">
            ?
          </span>
        </div>

        {/* Decorative lines */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-8 md:left-16 top-24 bottom-24 w-px bg-border origin-top hidden md:block"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="absolute right-8 md:right-16 top-24 bottom-24 w-px bg-border origin-top hidden md:block"
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center max-w-4xl"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-muted/50 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Typically respond within 24 hours
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-7xl md:text-[10rem] lg:text-[12rem] tracking-wider text-foreground leading-[0.85] mb-8"
          >
            HOW CAN
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_hsl(var(--foreground))]">
              WE HELP
            </span>
            ?
          </motion.h1>

          <motion.p variants={fadeUp} className="font-body text-sm md:text-base text-muted-foreground max-w-md mx-auto mb-12 leading-relaxed">
            Orders. Products. Sizing. Whatever you need — we're here.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase hover:bg-foreground/90 transition-all"
            >
              <Mail className="w-5 h-5" />
              Email Us
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Order%20Tracking%20Request`}
              className="group inline-flex items-center gap-3 px-10 py-5 border border-foreground text-foreground font-body text-sm tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-all"
            >
              <Search className="w-4 h-4" />
              Track Order
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── EMAIL SUPPORT — asymmetric layout ─── */}
      <section className="relative bg-foreground text-background py-24 md:py-36 px-6 md:px-12">
        {/* Background number */}
        <div className="absolute top-8 right-8 md:right-16 pointer-events-none select-none">
          <span className="font-heading text-[8rem] md:text-[14rem] text-background/[0.05] leading-none">01</span>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left — heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="font-body text-[10px] tracking-[0.5em] uppercase text-background/40 mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-background/40 inline-block" />
              Get in Touch
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-wider leading-[0.85] mb-6">
              EMAIL
              <br />
              SUPPORT
            </motion.h2>
            <motion.p variants={fadeUp} className="font-body text-sm text-background/50 leading-relaxed max-w-sm">
              Get personalized help from our team. Best for order inquiries, product questions, and detailed assistance.
            </motion.p>
          </motion.div>

          {/* Right — card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="border border-background/10 p-8 md:p-10 relative">
              <span className="absolute -top-3 left-6 px-3 py-1 bg-background text-foreground font-body text-[10px] tracking-[0.2em] uppercase">
                Recommended
              </span>

              <div className="space-y-5 mb-10 mt-4">
                {supportBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 border border-background/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-background/60" />
                    </div>
                    <span className="font-body text-sm text-background/80">{benefit}</span>
                  </div>
                ))}
              </div>

              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="group flex items-center justify-between w-full py-5 px-6 bg-background text-foreground font-body text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
              >
                {SUPPORT_EMAIL}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── WHAT TO INCLUDE ─── */}
      <section className="bg-background py-24 md:py-36 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-4">Before You Write</p>
            <h2 className="font-heading text-4xl md:text-6xl tracking-wider text-foreground">
              WHAT TO INCLUDE
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border"
          >
            {messageTips.map((tip, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-background p-10 md:p-12 text-center group hover:bg-muted/30 transition-colors"
              >
                <div className="relative mb-6">
                  <span className="font-heading text-6xl text-foreground/[0.06] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                    0{i + 1}
                  </span>
                  <div className="relative w-14 h-14 border border-border flex items-center justify-center mx-auto group-hover:border-foreground/30 transition-colors">
                    <tip.icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
                <h4 className="font-heading text-xl tracking-wider text-foreground mb-3">{tip.title}</h4>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── SUPPORT FAQ ─── */}
      <section className="bg-background py-24 md:py-36 px-6 md:px-12 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Left sticky heading */}
          <div className="md:col-span-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="md:sticky md:top-32"
            >
              <p className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-muted-foreground inline-block" />
                Support
              </p>
              <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-foreground leading-[0.85] mb-6">
                FAQ
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Quick answers to common questions about orders, shipping, and returns.
              </p>
            </motion.div>
          </div>

          {/* Right accordion */}
          <div className="md:col-span-8">
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } },
                  }}
                >
                  <AccordionItem
                    value={`faq-${i}`}
                    className="border-b border-border"
                  >
                    <AccordionTrigger className="py-6 font-body text-sm md:text-base text-foreground hover:no-underline hover:text-foreground/80 transition-colors">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed pb-6">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ─── STILL HAVE QUESTIONS — full-width CTA ─── */}
      <section className="relative bg-foreground text-background py-28 md:py-40 px-6 md:px-12 overflow-hidden">
        {/* Giant watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-heading text-[14rem] md:text-[26rem] text-background/[0.03] leading-none tracking-wider">
            NTY
          </span>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUp} className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-wider leading-[0.85] mb-6">
            STILL HAVE
            <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_hsl(var(--background))]">
              QUESTIONS
            </span>
            ?
          </motion.h2>

          <motion.p variants={fadeUp} className="font-body text-sm text-background/50 mb-10 leading-relaxed max-w-md mx-auto">
            Can't find what you're looking for? Our support team is ready to help with any questions.
          </motion.p>

          <motion.a
            variants={fadeUp}
            href={`mailto:${SUPPORT_EMAIL}`}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-background text-foreground font-body text-sm tracking-[0.2em] uppercase hover:bg-background/90 transition-all"
          >
            <Mail className="w-5 h-5" />
            Email Support
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
