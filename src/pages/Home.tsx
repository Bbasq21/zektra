import { Code, Palette, TrendingUp, Zap, Search, PenTool } from "lucide-react";
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
      title: "Innovación",
      description:
        "Aplicamos las últimas tecnologías y metodologías para crear soluciones de vanguardia.",
    },
    {
      title: "Estrategia",
      description:
        "Cada proyecto está respaldado por un análisis profundo y una planificación estratégica.",
    },
    {
      title: "Tecnología",
      description:
        "Dominamos las herramientas más avanzadas para transformar ideas en realidad digital.",
    },
  ];

  return (
    <>
      <Hero />

      {/* Mission Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Transformamos ideas en{" "}
              <span className="gradient-text">sistemas que generan resultados</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Somos un equipo de expertos digitales que combina creatividad,
              tecnología y estrategia para llevar tu negocio al siguiente nivel.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
              Nuestros 3 Pilares
            </h2>
            <p className="text-lg text-muted-foreground">
              La base de cada proyecto exitoso
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:border-secondary transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <h3 className="text-2xl font-heading font-bold text-secondary">
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

      {/* Services Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
              Nuestros Servicios Destacados
            </h2>
            <p className="text-lg text-muted-foreground">
              Soluciones completas para tu transformación digital
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-medium"
              asChild
            >
              <Link to="/servicios">Ver todos los servicios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="text-6xl text-secondary/20">"</div>
            <blockquote className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-relaxed">
              En el mundo digital, el futuro pertenece a quienes{" "}
              <span className="gradient-text">se atreven a innovar</span>
            </blockquote>
            <p className="text-lg text-muted-foreground">
              — Equipo ZEKTRA
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/80 to-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              Hablemos de tu proyecto y descubre cómo podemos ayudarte a
              alcanzar tus objetivos digitales.
            </p>
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium text-lg px-8"
              asChild
            >
              <Link to="/contacto">Hablemos de tu proyecto</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
