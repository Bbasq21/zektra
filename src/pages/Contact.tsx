import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      title: "Email",
      value: "info@zektra.com",
      description: "Escríbenos cuando quieras",
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+1 (555) 123-4567",
      description: "Lun-Vie 9:00 AM - 6:00 PM",
    },
    {
      icon: MapPin,
      title: "Ubicación",
      value: "Ciudad Digital",
      description: "Trabajamos remotamente",
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
              Hablemos de tu{" "}
              <span className="gradient-text">proyecto</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Estamos listos para escuchar tus ideas y ayudarte a transformarlas
              en realidad digital.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card
                  key={info.title}
                  className="group relative overflow-hidden bg-background border-border hover:border-secondary transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-6 text-center relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-heading font-semibold mb-2 text-foreground">
                      {info.title}
                    </h3>
                    <p className="text-secondary font-medium mb-1">
                      {info.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Info */}
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
                    Comienza tu transformación digital hoy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Completa el formulario y nos pondremos en contacto contigo
                    en menos de 24 horas. También puedes escribirnos
                    directamente por email o llamarnos.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Consulta gratuita
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Primera sesión sin compromiso para entender tus
                        necesidades
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Propuesta personalizada
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Soluciones adaptadas a tu presupuesto y objetivos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Respuesta rápida
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Te contactamos en menos de 24 horas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <Card className="border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
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
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
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
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
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
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
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
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium group"
                    >
                      Enviar mensaje
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
