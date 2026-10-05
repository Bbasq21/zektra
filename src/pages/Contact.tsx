import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensaje enviado con éxito. Te contactaremos pronto.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      num: "01",
      title: "Email",
      value: "info@zektra.com",
      description: "Escríbenos cuando quieras",
    },
    {
      icon: Phone,
      num: "02",
      title: "Teléfono",
      value: "+1 (555) 123-4567",
      description: "Lun-Vie 9:00 AM - 6:00 PM",
    },
    {
      icon: MapPin,
      num: "03",
      title: "Ubicación",
      value: "Ciudad Digital",
      description: "Trabajamos remotamente",
    },
  ];

  const benefits = [
    {
      title: "Consulta gratuita",
      description:
        "Primera sesión sin compromiso para entender tus necesidades",
    },
    {
      title: "Propuesta personalizada",
      description: "Soluciones adaptadas a tu presupuesto y objetivos",
    },
    {
      title: "Respuesta rápida",
      description: "Te contactamos en menos de 24 horas",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern grid-fade" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/15 blur-[120px] rounded-full" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <span className="mono-label text-muted-foreground">// Contacto</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight tracking-tighter">
              Hablemos de tu <span className="gradient-text">proyecto</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Estamos listos para escuchar tus ideas y ayudarte a transformarlas
              en realidad digital.
            </p>
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border max-w-7xl mx-auto">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.title}
                  className="group relative p-8 bg-card hover:bg-muted/40 transition-colors duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs tracking-widest text-secondary">
                      {info.num}
                    </span>
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors duration-300" />
                  </div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    {info.title}
                  </h3>
                  <p className="text-lg font-heading font-bold text-foreground group-hover:text-secondary transition-colors duration-300">
                    {info.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {info.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 pb-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left */}
            <div className="lg:col-span-5 space-y-10 animate-fade-in">
              <div>
                <span className="mono-label text-muted-foreground">// Inicio</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 tracking-tighter">
                  Tu transformación digital empieza <span className="gradient-text">aquí</span>
                </h2>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={benefit.title} className="flex gap-4">
                    <span className="font-mono text-xs text-primary pt-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="font-heading font-bold mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div
              className="lg:col-span-7 border border-border bg-card/50 rounded-2xl p-8 md:p-10 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mono-label text-muted-foreground block mb-2">
                    Nombre completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background border-border focus:border-secondary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mono-label text-muted-foreground block mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background border-border focus:border-secondary"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mono-label text-muted-foreground block mb-2">
                    Asunto
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="¿En qué podemos ayudarte?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-background border-border focus:border-secondary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mono-label text-muted-foreground block mb-2">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Cuéntanos sobre tu proyecto..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-background border-border focus:border-secondary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="group relative w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider text-sm h-14"
                >
                  Enviar mensaje
                  <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute -bottom-1 -right-1 w-full h-full border-b-2 border-r-2 border-secondary/40 group-hover:bottom-0 group-hover:right-0 transition-all" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
