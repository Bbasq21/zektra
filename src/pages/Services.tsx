import {
  Code,
  Palette,
  TrendingUp,
  Zap,
  Search,
  PenTool,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Desarrollo a la medida",
      description:
        "Creamos soluciones tecnológicas personalizadas que se adaptan perfectamente a las necesidades de tu negocio.",
      benefits: [
        "Aplicaciones web y móviles",
        "Sistemas empresariales",
        "Integración de APIs",
        "Arquitectura escalable",
      ],
    },
    {
      icon: Palette,
      title: "Branding",
      description:
        "Construimos identidades de marca únicas y memorables que conectan emocionalmente con tu audiencia.",
      benefits: [
        "Identidad visual completa",
        "Manual de marca",
        "Diseño de logotipo",
        "Estrategia de marca",
      ],
    },
    {
      icon: TrendingUp,
      title: "Marketing Digital",
      description:
        "Estrategias digitales integrales que impulsan tu presencia online y generan resultados medibles.",
      benefits: [
        "Campañas en redes sociales",
        "Email marketing",
        "Contenido estratégico",
        "Análisis de métricas",
      ],
    },
    {
      icon: Zap,
      title: "Automatizaciones",
      description:
        "Optimiza tus procesos empresariales con automatizaciones inteligentes que ahorran tiempo y recursos.",
      benefits: [
        "Workflows automatizados",
        "Integración de herramientas",
        "Chatbots inteligentes",
        "Procesos optimizados",
      ],
    },
    {
      icon: Search,
      title: "SEO",
      description:
        "Posiciona tu sitio web en los primeros resultados de búsqueda y aumenta tu visibilidad orgánica.",
      benefits: [
        "Optimización on-page",
        "Estrategia de contenidos",
        "Link building",
        "Análisis de competencia",
      ],
    },
    {
      icon: PenTool,
      title: "Diseño Gráfico",
      description:
        "Diseños impactantes y profesionales que comunican tu mensaje de forma efectiva y atractiva.",
      benefits: [
        "Diseño publicitario",
        "Material corporativo",
        "Infografías",
        "Diseño para redes sociales",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern grid-fade" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/15 blur-[120px] rounded-full" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <span className="mono-label text-muted-foreground">// Servicios</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight tracking-tighter">
              Soluciones para <span className="gradient-text">escalar tu negocio</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Soluciones integrales para impulsar tu transformación digital y
              llevar tu negocio al siguiente nivel.
            </p>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border border-border max-w-7xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group relative p-8 md:p-12 bg-card hover:bg-muted/40 transition-colors duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs tracking-widest text-secondary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-secondary/10 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-4 tracking-tight group-hover:text-secondary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    {service.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span className="text-sm text-muted-foreground">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/contacto"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary group-hover:gap-3 transition-all"
                  >
                    Más información
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden border-t border-border">
        <div className="absolute inset-0 grid-pattern grid-fade opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <span className="mono-label text-muted-foreground">// ¿No encuentras lo que buscas?</span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tighter">
              Creamos soluciones <span className="gradient-text">a medida</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contáctanos y cuéntanos sobre tu proyecto. Diseñamos estrategias
              personalizadas para cada necesidad.
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
    </div>
  );
};

export default Services;
