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
import { Card, CardContent } from "@/components/ui/card";
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
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
              Nuestros{" "}
              <span className="gradient-text">Servicios</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Soluciones integrales para impulsar tu transformación digital y
              llevar tu negocio al siguiente nivel.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group relative overflow-hidden bg-background border-border hover:border-secondary transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                        <Icon className="w-7 h-7 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-heading font-bold mb-2 text-foreground group-hover:text-secondary transition-colors duration-300">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-3 mb-6">
                      {service.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          <span className="text-sm text-muted-foreground">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground group/btn"
                      asChild
                    >
                      <Link to="/contacto">
                        Más información
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-lg text-white/90">
              Contáctanos y cuéntanos sobre tu proyecto. Creamos soluciones
              personalizadas para cada necesidad.
            </p>
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium"
              asChild
            >
              <Link to="/contacto">Hablemos de tu proyecto</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
