import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold gradient-text">
              ZEKTRA
            </h3>
            <p className="text-sm text-muted-foreground">
              Impulsamos tu futuro digital
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-foreground">
              Enlaces
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/servicios"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-foreground">
              Servicios
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Desarrollo a la medida</li>
              <li>Branding</li>
              <li>Marketing Digital</li>
              <li>Automatizaciones</li>
              <li>SEO</li>
              <li>Diseño Gráfico</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-foreground">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail size={16} className="text-secondary" />
                <span>info@zektra.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone size={16} className="text-secondary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin size={16} className="text-secondary" />
                <span>Ciudad Digital</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 ZEKTRA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
