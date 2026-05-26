import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Layers, Globe, Code2, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Built on Vite for instant hot module replacement and lightning-quick builds.",
  },
  {
    icon: Shield,
    title: "Type Safe",
    description: "TypeScript throughout — catch bugs at compile time, not at runtime.",
  },
  {
    icon: Layers,
    title: "Component Library",
    description: "Shadcn/ui components ready to use — beautiful, accessible, and customizable.",
  },
  {
    icon: Globe,
    title: "Production Ready",
    description: "Deploy with one click. Your app is optimized and ready for the world.",
  },
  {
    icon: Code2,
    title: "Clean Architecture",
    description: "Organized file structure that scales with your project as it grows.",
  },
  {
    icon: Sparkles,
    title: "Modern Stack",
    description: "React 18, TanStack Query, Wouter, and Tailwind CSS — the best of the ecosystem.",
  },
];

const stats = [
  { value: "< 50ms", label: "Hot reload" },
  { value: "100%", label: "Type coverage" },
  { value: "Zero", label: "Config needed" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/70">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-serif font-bold text-lg tracking-tight gradient-text" data-testid="nav-logo">
            MyApp
          </span>
          <div className="flex items-center gap-3">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-features"
            >
              Features
            </a>
            <button
              className="text-sm px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-primary"
              data-testid="button-get-started"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-6 grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-8"
            data-testid="hero-badge"
          >
            <Sparkles className="w-3 h-3" />
            React + Vite + TypeScript
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
            data-testid="hero-headline"
          >
            Build something
            <br />
            <span className="gradient-text">remarkable.</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            data-testid="hero-description"
          >
            A modern React starter that gets out of your way. Everything you need to
            build fast, ship confidently, and scale without drama.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all glow-primary active:scale-95"
              data-testid="button-start-building"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary/50 transition-colors"
              data-testid="button-view-docs"
            >
              <Code2 className="w-4 h-4" /> View Docs
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="font-serif text-3xl sm:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2
              className="font-serif text-3xl sm:text-4xl font-bold mb-4"
              data-testid="features-heading"
            >
              Everything included
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No setup fatigue. No decision paralysis. Just open your editor and start building.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:glow-primary transition-all duration-300 cursor-default"
                data-testid={`feature-card-${i}`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-3xl mx-auto text-center rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-12 glow-primary"
          data-testid="cta-section"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Ready to ship?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Your app is already running. Now it just needs your ideas.
          </p>
          <button
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all active:scale-95 glow-primary"
            data-testid="button-cta-start"
          >
            Start Building <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif font-bold gradient-text" data-testid="footer-logo">
            MyApp
          </span>
          <p className="text-xs text-muted-foreground">
            Built with React, Vite, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
