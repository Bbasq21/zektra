import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { num: "01 / INNOVACIÓN", value: "100%", label: "Digital-first" },
  { num: "02 / ESTRATEGIA", value: "+50", label: "Proyectos lanzados" },
  { num: "03 / TECNOLOGÍA", value: "24/7", label: "Monitoreo activo" },
  { num: "04 / RESULTADOS", value: "98%", label: "Satisfacción clientes" },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-16">
      {/* Background technical elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 grid-pattern grid-fade" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: content */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              Sistemas activos 2.4.0
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight tracking-tighter">
              Impulsamos tu{" "}
              <span className="gradient-text block">futuro digital</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl font-light leading-relaxed">
              Construimos infraestructuras de alto rendimiento, estrategias de
              impacto y automatizaciones inteligentes para la próxima era del
              mercado global.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="group relative bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider text-sm h-12 px-8"
                asChild
              >
                <Link to="/contacto">
                  Agenda tu consulta
                  <div className="absolute -bottom-1 -right-1 w-full h-full border-b-2 border-r-2 border-secondary/40 group-hover:bottom-0 group-hover:right-0 transition-all" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-foreground/5 hover:border-foreground/20 font-bold uppercase tracking-wider text-sm h-12 px-8"
                asChild
              >
                <Link to="/servicios" className="flex items-center gap-2">
                  Nuestros servicios
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: technical visual */}
          <div
            className="lg:col-span-5 relative animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative aspect-square border border-border bg-card/50 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

              {/* HUD panel */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 border border-secondary/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <div className="text-[120px] md:text-[140px] font-heading font-bold opacity-5 select-none">
                  ZKT
                </div>
                <div className="absolute inset-0 flex flex-col p-6 font-mono text-[10px] text-secondary/60">
                  <div className="flex justify-between border-b border-secondary/20 pb-2">
                    <span>CORE_INIT</span>
                    <span>[SUCCESS]</span>
                  </div>
                  <div className="mt-auto flex flex-col gap-1">
                    <div className="w-full h-1 bg-white/5">
                      <div className="w-3/4 h-full bg-secondary" />
                    </div>
                    <span>PROCESSING ASSETS... 78%</span>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute top-12 -right-4 p-4 bg-card border border-border rounded-lg shadow-2xl shadow-black/50 animate-float">
                <div className="text-[10px] uppercase font-mono text-muted-foreground mb-1">
                  Conversion Rate
                </div>
                <div className="text-xl font-heading font-bold text-secondary">
                  +42.8%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-12 animate-fade-in">
          {stats.map((stat, index) => (
            <div key={stat.num} className="space-y-1">
              <div className="text-xs font-mono text-primary">{stat.num}</div>
              <div className="text-3xl md:text-4xl font-heading font-bold tracking-tighter">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
