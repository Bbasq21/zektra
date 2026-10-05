import { Code, Palette, TrendingUp, Zap, Search, PenTool, ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  const services = [
    {
      icon: Code,
      title: "Desarrollo a la medida",
      description:
        "Soluciones tecnológicas personalizadas que se adaptan a tus necesidades específicas.",
    },
    {
      icon: Palette,
      title: "Branding",
      description:
        "Creamos identidades visuales únicas que conectan con tu audiencia.",
    },
    {
      icon: TrendingUp,
      title: "Marketing Digital",
      description:
        "Estrategias digitales que impulsan tu presencia online y generan resultados.",
    },
    {
      icon: Zap,
      title: "Automatizaciones",
      description:
        "Optimiza procesos y ahorra tiempo con automatizaciones inteligentes.",
    },
    {
      icon: Search,
      title: "SEO",
      description:
        "Posiciona tu marca en los primeros resultados de búsqueda.",
    },
    {
      icon: PenTool,
      title: "Diseño Gráfico",
      description:
        "Diseños impactantes que comunican tu mensaje de forma efectiva.",
    },
  ];

  const pillars = [
    {
      line: "bg-secondary",
      title: "INNOVACIÓN",
      description:
        "Exploramos fronteras tecnológicas para ofrecer soluciones que aún no existen en el mercado convencional.",
    },
    {
      line: "bg-primary",
      title: "ESTRATEGIA",
      description:
        "Cada línea de código y cada campaña está alineada con objetivos de negocio medibles y escalables.",
    },
    {
      line: "bg-accent",
      title: "TECNOLOGÍA",
      description:
        "Arquitecturas robustas diseñadas para soportar el crecimiento masivo sin comprometer la velocidad.",
    },
  ];

  return (
    <>
      <Hero />

      {/* Mission */}
      <section className="py-24 px-4 border-y border-border bg-card/30">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
          <span className="mono-label text-muted-foreground">// Nuestra misión</span>
          <p className="text-3xl md:text-5xl font-heading font-light leading-tight text-foreground">
            Transformamos ideas en{" "}
            <span className="gradient-text">sistemas que generan resultados</span>
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Somos un equipo de expertos digitales que combina creatividad,
            tecnología y estrategia para llevar tu negocio al siguiente nivel.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="group">
                <div className={`w-12 h-1 mb-6 ${pillar.line} transition-all duration-500 group-hover:w-full`} />
                <h3 className="text-2xl font-heading font-bold mb-4 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-28 bg-[hsl(var(--card))]/40">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 animate-fade-in">
              <span className="mono-label text-muted-foreground">// Servicios destacados</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 tracking-tighter">
                NUESTROS <span className="gradient-text">SERVICIOS</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
              {services.map((service, index) => (
                <ServiceCard key={service.title} {...service} index={index} />
              ))}
            </div>
            <div className="mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-foreground/5 hover:border-foreground/20 font-bold uppercase tracking-wider text-sm h-12 px-8 group"
                asChild
              >
                <Link to="/servicios" className="flex items-center gap-2">
                  Ver todos los servicios
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Founder quote */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto border-l-4 border-primary pl-8 md:pl-12 animate-fade-in">
            <blockquote className="text-3xl md:text-5xl font-heading font-bold leading-tight text-foreground opacity-90 mb-8 tracking-tight">
              "LA TECNOLOGÍA NO ES EL FIN, ES EL MOTOR QUE ACELERA LA VISIÓN
              HUMANA HACIA EL INFINITO."
            </blockquote>
            <cite className="not-italic font-mono text-sm tracking-widest uppercase text-secondary">
              Fundador & CEO — ZEKTRA
            </cite>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-28 overflow-hidden border-t border-border">
        <div className="absolute inset-0 grid-pattern grid-fade opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[300px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <span className="mono-label text-muted-foreground">// Próximo paso</span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter">
              ¿LISTO PARA EL{" "}
              <span className="gradient-text">SIGUIENTE NIVEL?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hablemos de tu proyecto y descubre cómo podemos ayudarte a
              alcanzar tus objetivos digitales.
            </p>
            <Button
              size="lg"
              className="group relative bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider text-sm h-14 px-12"
              asChild
            >
              <Link to="/contacto">
                Hablemos de tu proyecto
                <div className="absolute -bottom-1 -right-1 w-full h-full border-b-2 border-r-2 border-secondary/40 group-hover:bottom-0 group-hover:right-0 transition-all" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
