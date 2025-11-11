import { Calendar, ArrowRight, TrendingUp, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Blog = () => {
  const articles = [
    {
      title: "El Futuro de la Inteligencia Artificial en los Negocios",
      excerpt:
        "Descubre cómo la IA está transformando la forma en que las empresas operan y toman decisiones estratégicas.",
      category: "Inteligencia Artificial",
      date: "15 de Enero, 2025",
      readTime: "5 min",
      icon: Brain,
    },
    {
      title: "Automatización: La Clave para Escalar tu Negocio",
      excerpt:
        "Aprende cómo implementar automatizaciones efectivas que liberen tiempo y aumenten la productividad.",
      category: "Automatización",
      date: "10 de Enero, 2025",
      readTime: "4 min",
      icon: Zap,
    },
    {
      title: "Estrategias de Marketing Digital para 2025",
      excerpt:
        "Las tendencias y estrategias que dominarán el marketing digital en este nuevo año.",
      category: "Marketing",
      date: "5 de Enero, 2025",
      readTime: "6 min",
      icon: TrendingUp,
    },
    {
      title: "Diseño Web: Más Allá de lo Visual",
      excerpt:
        "Cómo crear experiencias digitales que combinen estética, funcionalidad y conversión.",
      category: "Diseño",
      date: "28 de Diciembre, 2024",
      readTime: "5 min",
      icon: Brain,
    },
    {
      title: "SEO en 2025: Guía Completa",
      excerpt:
        "Todo lo que necesitas saber sobre optimización para motores de búsqueda en el nuevo año.",
      category: "SEO",
      date: "20 de Diciembre, 2024",
      readTime: "7 min",
      icon: TrendingUp,
    },
    {
      title: "Transformación Digital: Por Dónde Empezar",
      excerpt:
        "Una guía práctica para iniciar el proceso de transformación digital en tu empresa.",
      category: "Tecnología",
      date: "15 de Diciembre, 2024",
      readTime: "6 min",
      icon: Zap,
    },
  ];

  const categories = [
    "Todos",
    "Inteligencia Artificial",
    "Automatización",
    "Marketing",
    "Diseño",
    "SEO",
    "Tecnología",
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
              Blog &{" "}
              <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Artículos, consejos y tendencias sobre tecnología, marketing
              digital, IA y automatización.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto animate-fade-in">
            {categories.map((category, index) => (
              <Badge
                key={category}
                variant={index === 0 ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-300 ${
                  index === 0
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "border-border hover:border-secondary hover:bg-secondary/10"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {articles.map((article, index) => {
              const Icon = article.icon;
              return (
                <Card
                  key={article.title}
                  className="group relative overflow-hidden bg-card border-border hover:border-secondary transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-6 relative z-10">
                    {/* Icon & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-secondary" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-secondary/50 text-secondary"
                      >
                        {article.category}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold mb-3 text-foreground group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.date}</span>
                      </div>
                      <span>{article.readTime} lectura</span>
                    </div>

                    {/* Read More */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 w-full group/btn text-secondary hover:text-secondary hover:bg-secondary/10"
                    >
                      Leer más
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-medium"
            >
              Cargar más artículos
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Mantente{" "}
              <span className="gradient-text">actualizado</span>
            </h2>
            <p className="text-muted-foreground">
              Suscríbete a nuestro newsletter y recibe los últimos artículos,
              consejos y novedades directamente en tu inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:border-secondary focus:outline-none transition-colors"
              />
              <Button
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium"
              >
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
