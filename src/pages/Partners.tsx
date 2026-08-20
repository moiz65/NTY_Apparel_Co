import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrgencyBanner from "@/components/UrgencyBanner";
import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Share2, TrendingUp, Zap, Shield, Package, Clock, BarChart3 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stats = [
  { value: "10–20%", label: "Tiered", sub: "Commission rates" },
  { value: "3", label: "Levels", sub: "Performance tiers" },
  { value: "30 days", label: "Attribution", sub: "Cookie window" },
  { value: "Monthly", label: "Payouts", sub: "No minimum threshold" },
];

const steps = [
  { number: "01", title: "Sign up", desc: "Create your account and get your unique affiliate code instantly." },
  { number: "02", title: "Share", desc: "Promote NTY to your audience with your personal referral link." },
  { number: "03", title: "Earn", desc: "Start at 10% commission and climb to 20% as your volume grows." },
  { number: "04", title: "Get paid", desc: "Receive monthly payouts with no minimum threshold." },
];

const tiers = [
  { number: "01", name: "Bronze", range: "$0 – $4,999 GMV", rate: "10%" },
  { number: "02", name: "Silver", range: "$5,000 – $9,999 GMV", rate: "15%" },
  { number: "03", name: "Gold", range: "$10,000+ GMV", rate: "20%" },
];

const benefits = [
  { icon: TrendingUp, title: "High conversion rates", desc: "Premium apparel that customers love, leading to high retention and reorders." },
  { icon: Shield, title: "Quality that sells", desc: "Performance fabrics and tailored fits that speak for themselves." },
  { icon: Package, title: "Fast shipping", desc: "Quick processing with free shipping on orders over $75." },
  { icon: Clock, title: "30-day cookie window", desc: "Long attribution period ensures you get credit for your referrals." },
  { icon: DollarSign, title: "Tiered commissions", desc: "Earn 10%–20% based on your 30-day rolling sales volume." },
  { icon: Zap, title: "Instant approval", desc: "Start earning immediately with no waiting period for approval." },
];

const earnings = [
  { tier: "$3,000 GMV at Bronze (10%)", amount: "$300" },
  { tier: "$7,500 GMV at Silver (15%)", amount: "$1,125" },
  { tier: "$10,000+ GMV at Gold (20%)", amount: "$2,000+" },
];

const faqs = [
  { q: "How much commission do I earn?", a: "All affiliates start at 10% (Bronze). As your 30-day rolling sales volume grows, your commission rate increases automatically up to 20% (Gold). Affiliates consistently doing over $10,000/month may be invited to a custom ambassador program." },
  { q: "What is commission calculated on?", a: "Commissions are calculated on product subtotal only — shipping, processing, and protection fees are excluded." },
  { q: "How and when do I get paid?", a: "Payouts are processed monthly. There is no minimum threshold — you get paid for every sale you generate." },
  { q: "How long does the tracking cookie last?", a: "We use a 30-day cookie window, so you'll get credit for any purchase made within 30 days of a click." },
  { q: "Can I promote on social media?", a: "Absolutely. Share your referral link on Instagram, TikTok, YouTube, Twitter, or any platform where your audience lives." },
  { q: "Is there a minimum sales requirement?", a: "No. There are no minimum sales requirements to stay in the program." },
];

const FOLLOWER_RANGES = ["< 1,000", "1,000 – 5,000", "5,000 – 10,000", "10,000 – 50,000", "50,000 – 100,000", "100,000 – 500,000", "500,000+"];
const FIND_OPTIONS = ["Instagram", "TikTok", "YouTube", "Friend / referral", "Search engine", "Already a customer", "Other"];

const Partners = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [socialHandles, setSocialHandles] = useState("");
  const [instagramFollowers, setInstagramFollowers] = useState("");
  const [tiktokFollowers, setTiktokFollowers] = useState("");
  const [totalFollowersRange, setTotalFollowersRange] = useState("");
  const [platformInfo, setPlatformInfo] = useState("");
  const [howDidYouFind, setHowDidYouFind] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !socialHandles || !instagramFollowers || !tiktokFollowers || !howDidYouFind) return;
    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const { error } = await supabase.from("affiliate_applications").insert({
        name: fullName,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        social_handles: socialHandles.trim(),
        instagram_followers: instagramFollowers ? parseInt(instagramFollowers, 10) : null,
        tiktok_followers: tiktokFollowers ? parseInt(tiktokFollowers, 10) : null,
        total_followers_range: totalFollowersRange || null,
        platform_info: platformInfo.trim() || null,
        how_did_you_find: howDidYouFind,
        additional_notes: additionalNotes.trim() || null,
      } as never);
      if (error) throw error;
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "affiliate-application-received",
          recipientEmail: email.trim(),
          idempotencyKey: `affiliate-app-${email.trim().toLowerCase()}-${Date.now()}`,
          templateData: { first_name: firstName.trim() },
        },
      });
      setSubmitted(true);
      toast.success("Application received — pending review");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToApply = () => {
    document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <UrgencyBanner />
      <Header />

      {/* Hero */}
      <section className="relative pt-8 pb-20 md:pt-24 md:pb-40 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="font-heading text-[16rem] md:text-[30rem] text-foreground/[0.03] leading-none tracking-wider select-none">
            REP
          </span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-6 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-muted-foreground inline-block" />
            Affiliate Program
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-[3.5rem] sm:text-[5rem] md:text-[8rem] lg:text-[11rem] leading-[0.82] tracking-wider text-foreground"
          >
            REP WHAT
            <br />
            YOU <span className="text-foreground/60">BELIEVE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-body text-sm text-muted-foreground leading-relaxed mt-8 max-w-md"
          >
            Earn 10%–30% commission on every NTY sale. The more you sell, the more you earn.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-2xl"
          >
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="font-heading text-3xl md:text-4xl tracking-wider text-foreground">{stat.value}</p>
                <p className="font-body text-xs text-foreground font-semibold mt-1">{stat.label}</p>
                <p className="font-body text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            onClick={scrollToApply}
            className="group relative inline-flex items-center gap-3 bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase px-10 py-4 mt-12 overflow-hidden"
          >
            <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 flex items-center gap-3">
              Become a Partner
              <ArrowRight className="w-4 h-4" />
            </span>
          </motion.button>
        </div>
      </section>

      {/* Why Partners Choose Us — Benefits Grid */}
      <section className="py-24 md:py-36 px-6 md:px-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            custom={0} variants={fadeUp}
            className="text-center mb-20"
          >
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-4">Benefits</p>
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-foreground">
              WHY PARTNERS <span className="text-foreground/60">CHOOSE US</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-4">Everything you need to build a sustainable income stream.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                custom={i} variants={fadeUp}
                className="flex gap-5"
              >
                <div className="w-12 h-12 border border-border flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-foreground mb-1">{b.title}</h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={scrollToApply}
              className="group relative inline-flex items-center gap-3 bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase px-10 py-4 overflow-hidden"
            >
              <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-3">
                Become a Partner
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            custom={0} variants={fadeUp}
            className="text-center mb-20"
          >
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-4">Get Started</p>
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-foreground">
              HOW IT <span className="text-foreground/60">WORKS</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-4">Start earning in minutes with our simple affiliate process.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                custom={i} variants={fadeUp}
              >
                <span className="font-heading text-5xl md:text-6xl text-foreground/10 leading-none">{step.number}</span>
                <h3 className="font-body text-sm font-semibold text-foreground mt-3 mb-2">{step.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-24 md:py-36 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            custom={0} variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-4">Commission Tiers</p>
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-foreground">
              EARN MORE <span className="text-foreground/60">AS YOU GROW</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
              Our performance-based affiliate program rewards your results. The more you sell, the more you earn — tracked on a 30-day rolling basis.
            </p>
          </motion.div>

          <div className="space-y-3">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }}
                custom={i} variants={fadeUp}
                className="flex items-center justify-between border border-border px-6 py-5 hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <span className="font-body text-xs text-muted-foreground">{tier.number}</span>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{tier.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{tier.range}</p>
                  </div>
                </div>
                <span className="font-heading text-3xl md:text-4xl tracking-wider text-foreground">{tier.rate}</span>
              </motion.div>
            ))}
          </div>

          <p className="font-body text-xs text-muted-foreground text-center mt-8 max-w-md mx-auto leading-relaxed">
            Commission tiers are based on your total sales volume (GMV) within a rolling 30-day window. All affiliates start at 10%. Commissions are calculated on product subtotal only.
          </p>
        </div>
      </section>

      {/* Example Earnings */}
      <section className="py-20 px-6 md:px-12 bg-muted/30">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={0} variants={fadeUp}
            className="border border-border p-8"
          >
            <h3 className="font-body text-sm font-semibold text-foreground text-center mb-6">Example monthly earnings</h3>
            <div className="space-y-0">
              {earnings.map((e, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
                  <span className="font-body text-xs text-muted-foreground">{e.tier}</span>
                  <span className="font-heading text-xl tracking-wider text-foreground">{e.amount}</span>
                </div>
              ))}
            </div>
            <p className="font-body text-[10px] text-muted-foreground text-center mt-4">Based on average affiliate performance</p>
          </motion.div>

          <div className="text-center mt-10">
            <button
              onClick={scrollToApply}
              className="group relative inline-flex items-center gap-3 bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase px-10 py-4 overflow-hidden"
            >
              <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-3">
                Apply to Be a Partner
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-36 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            custom={0} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-foreground">
              FREQUENTLY ASKED <span className="text-foreground/60">QUESTIONS</span>
            </h2>
          </motion.div>

          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }}
                custom={i} variants={fadeUp}
              >
                <AccordionItem value={`faq-${i}`} className="border-b border-border">
                  <AccordionTrigger className="py-6 font-body text-sm text-foreground hover:no-underline">
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
      </section>

      {/* Apply Section */}
      <section id="apply-section" className="relative py-28 md:py-40 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="relative z-10 max-w-xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.p custom={0} variants={fadeUp} className="font-body text-[10px] tracking-[0.5em] uppercase text-background/40 mb-6">
              Apply Now
            </motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-heading text-5xl md:text-7xl tracking-wider text-background mb-4">
              JOIN THE TEAM
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} className="font-body text-sm text-background/50 leading-relaxed mb-10">
              Fill out the form below and we'll get back to you within 48 hours.
            </motion.p>

            {!submitted ? (
              <motion.form custom={3} variants={fadeUp} onSubmit={handleSubmit} className="space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">First Name *</label>
                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={60}
                      className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors" />
                  </div>
                  <div>
                    <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">Last Name *</label>
                    <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={60}
                      className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">Email *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255}
                    className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors" />
                </div>

                <div>
                  <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">Phone Number *</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" maxLength={30}
                    className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors" />
                </div>

                <div>
                  <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">Social Handle(s) *</label>
                  <input type="text" required value={socialHandles} onChange={(e) => setSocialHandles(e.target.value)} placeholder="@yourhandle on Instagram, TikTok, etc." maxLength={200}
                    className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">Instagram Followers *</label>
                    <input type="number" required min="0" value={instagramFollowers} onChange={(e) => setInstagramFollowers(e.target.value)} placeholder="e.g. 5000"
                      className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors" />
                  </div>
                  <div>
                    <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">TikTok Followers *</label>
                    <input type="number" required min="0" value={tiktokFollowers} onChange={(e) => setTiktokFollowers(e.target.value)} placeholder="e.g. 12000"
                      className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">Total Followers (All Platforms)</label>
                  <select value={totalFollowersRange} onChange={(e) => setTotalFollowersRange(e.target.value)}
                    className="w-full bg-background/10 border border-background/20 text-background font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors">
                    <option value="" className="bg-foreground text-background">Select a range (optional)…</option>
                    {FOLLOWER_RANGES.map((r) => <option key={r} value={r} className="bg-foreground text-background">{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">Platform / Audience Info</label>
                  <textarea value={platformInfo} onChange={(e) => setPlatformInfo(e.target.value)} placeholder="Tell us about your audience, niche, content style, etc." rows={3} maxLength={1000}
                    className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors resize-none" />
                </div>

                <div>
                  <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">How Did You Find Us? *</label>
                  <select required value={howDidYouFind} onChange={(e) => setHowDidYouFind(e.target.value)}
                    className="w-full bg-background/10 border border-background/20 text-background font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors">
                    <option value="" className="bg-foreground text-background">Select an option…</option>
                    {FIND_OPTIONS.map((r) => <option key={r} value={r} className="bg-foreground text-background">{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-body text-[11px] tracking-[0.2em] uppercase text-background/60 block mb-2">Additional Notes</label>
                  <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Anything else you'd like us to know?" rows={3} maxLength={1000}
                    className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/60 transition-colors resize-none" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full relative bg-background text-foreground font-body text-sm tracking-[0.2em] uppercase px-8 py-4 overflow-hidden disabled:opacity-50"
                >
                  <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? "Submitting..." : "Submit Application"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-gold/40 bg-gradient-to-br from-gold-soft/10 to-transparent p-10 space-y-5"
              >
                <p className="font-heading text-3xl tracking-wider text-background">APPLICATION PENDING</p>
                <p className="font-body text-sm text-background/70 leading-relaxed">
                  Thanks for applying to the NTY Partner Program. Your application is under review — our team will get back to you within 48 hours.
                </p>
                <div className="border-t border-background/15 pt-5 space-y-2">
                  <p className="font-heading text-sm tracking-widest text-gold uppercase">While you wait</p>
                  <p className="font-body text-sm text-background/70 leading-relaxed">
                    Check your email for an invite link to our private Discord community — where our partners connect, share content, and get early access to drops.
                  </p>
                </div>
                <p className="font-body text-xs text-background/40">
                  Didn't get the email? Check your spam folder or reach out to support@ntyapparel.com.
                </p>
              </motion.div>
            )}

            <motion.p custom={4} variants={fadeUp} className="font-body text-xs text-background/30 mt-8">
              Still have questions? Contact our affiliate team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
