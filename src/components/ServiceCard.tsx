import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon: Icon, title, description, index }: ServiceCardProps) => {
  return (
    <div className="group relative p-8 md:p-10 bg-card hover:bg-muted/40 transition-colors duration-300 cursor-pointer">
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-xs tracking-widest text-secondary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-secondary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
