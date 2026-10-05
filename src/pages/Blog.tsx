import { Calendar, ArrowRight, TrendingUp, Zap, Brain, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Blog = () => {
  const articles = [
    {
      title: "El Futuro de la Inteligencia Artificial en los Negocios",
      excerpt:
        "Descubre cómo la IA está transformando la forma en que las empresas operan y toman decisiones estratégicas.",
      category: "Inteligencia Artificial",
      date: "15 Ene 2026",
      readTime: "5 min",
      icon: Brain,
    },
    {
      title: "Automatización: La Clave para Escalar tu Negocio",
      excerpt:
        "Aprende cómo implementar automatizaciones efectivas que liberen tiempo y aumenten la productividad.",
      category: "Automatización",
      date: "10 Ene 2026",
      readTime: "4 min",
      icon: Zap,
    },
    {
      title: "Estrategias de Marketing Digital para 2026",
      excerpt:
        "Las tendencias y estrategias que dominarán el marketing digital este año.",
      category: "Marketing",
      date: "05 Ene 2026",
      readTime: "6 min",
      icon: TrendingUp,
    },
    {
      title: "Diseño Web: Más Allá de lo Visual",
      excerpt:
        "Cómo crear experiencias digitales que combinen estética, funcionalidad y conversión.",
      category: "Diseño",
      date: "28 Dic 2025",
      readTime: "5 min",
      icon: Palette,
    },
    {
      title: "SEO en 2026: Guía Completa",
      excerpt:
        "Todo lo que necesitas saber sobre optimización para motores de búsqueda este año.",
      category: "SEO",
      date: "20 Dic 2025",
      readTime: "7 min",
      icon: TrendingUp,
    },
    {
      title: "Transformación Digital: Por Dónde Empezar",
      excerpt:
        "Una guía práctica para iniciar el proceso de transformación digital en tu empresa.",
      category: "Tecnología",
      date: "15 Dic 2025",
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
      {/* Hero */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern grid-fade" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/15 blur-[120px] rounded-full" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <span className="mono-label text-muted-foreground">// Blog & Insights</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight tracking-tighter">
              Ideas que <span className="gradient-text">impulsan</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Artículos, consejos y tendencias sobre tecnología, marketing
              digital, IA y automatización.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 max-w-4xl mx-auto animate-fade-in">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest border transition-all duration-300 ${
                  index === 0
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "border-border text-muted-foreground hover:border-secondary hover:text-secondary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border max-w-7xl mx-auto">
            {articles.map((article, index) => {
              const Icon = article.icon;
              return (
                <article
                  key={article.title}
                  className="group relative p-8 bg-card hover:bg-muted/40 transition-colors duration-300 cursor-pointer animate-fade-in flex flex-col"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-secondary/10 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors duration-300" />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border text-muted-foreground font-mono text-[10px] uppercase tracking-widest"
                    >
                      {article.category}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-heading font-bold mb-3 leading-snug group-hover:text-secondary transition-colors duration-300">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground pt-4 mt-auto border-t border-border">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                    <span>{article.readTime}</span>
                  </div>

                  <span className="inline-flex items-center gap-2 mt-4 font-mono text-xs uppercase tracking-widest text-secondary group-hover:gap-3 transition-all">
                    Leer más
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-24 overflow-hidden border-t border-border">
        <div className="absolute inset-0 grid-pattern grid-fade opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
            <span className="mono-label text-muted-foreground">// Newsletter</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tighter">
              Mantente <span className="gradient-text">actualizado</span>
            </h2>
            <p className="text-muted-foreground">
              Recibe los últimos artículos, consejos y novedades directamente
              en tu inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:border-secondary focus:outline-none transition-colors font-mono text-sm"
              />
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider text-sm">
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
