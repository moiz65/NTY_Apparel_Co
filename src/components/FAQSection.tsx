import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What does 'Natty' mean?",
    a: "Natty is short for 'natural', meaning no performance enhancing drugs. We celebrate athletes who build their physique the honest way.",
  },
  {
    q: "What makes NATTY different from other fitness apparel brands?",
    a: "Most fitness brands rely on enhanced athletes, digital edits, or hype driven marketing. NATTY is built differently, we use premium quality materials, honest storytelling and stand as a badge of honor for those who train and live naturally. When you wear NATTY, you're representing real values, not illusions.",
  },
  {
    q: "Is Natty only for bodybuilders?",
    a: "Not at all. NATTY is for anyone who values authenticity, effort and resilience, whether you're lifting in the gym, hiking outdoors, or just living your truth day to day. It's about embracing discipline and being proud of your process, wherever you are on your journey.",
  },
  {
    q: "What are the core values of Natty?",
    a: "Authenticity: No filters, No lies.\n\nIntegrity: No shortcuts, no compromises.\n\nHard Work: Strength isn't bought, it's built.\n\nEmpowerment: Be proud of your process.\n\nResilience: Show up and keep going.\n\nAwareness: Promote real progress.",
  },
  {
    q: "Why should I join the movement?",
    a: "Because Natty isn't just apparel, it's a declaration: I train natural. I live honest. I'm proud of the process. If that resonates with you, then you're not just a customer, you're part of the reason NATTY exists.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 md:py-36 px-6 md:px-12 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-muted-foreground inline-block" />
            Support
          </p>
          <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-foreground">
            FAQ
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-0">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <AccordionItem value={`faq-${i}`} className="border-b border-border">
                <AccordionTrigger className="py-6 font-body text-sm md:text-base text-foreground hover:no-underline hover:text-foreground/80 transition-colors text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed pb-6 whitespace-pre-line">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
