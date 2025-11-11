import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-card border border-secondary/20">
            <Zap className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">
              Innovación Digital
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight">
            Impulsamos tu{" "}
            <span className="gradient-text">futuro digital</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transformamos ideas en sistemas que generan resultados. En ZEKTRA,
            la innovación no es una opción: es nuestro idioma.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium group"
              asChild
            >
              <Link to="/contacto">
                Agenda tu consulta
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary hover:bg-primary/10 font-medium"
              asChild
            >
              <Link to="/servicios">Ver servicios</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-heading font-bold text-secondary">
                100%
              </div>
              <div className="text-sm text-muted-foreground">
                Digital
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-heading font-bold text-secondary">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">
                Soporte
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-heading font-bold text-secondary">
                +50
              </div>
              <div className="text-sm text-muted-foreground">
                Proyectos
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
