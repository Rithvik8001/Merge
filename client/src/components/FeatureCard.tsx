import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <div className="border border-border/40 rounded-sm p-6 hover:border-border/80 hover:bg-muted/30 transition-all duration-300">
      <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center mb-4">
        <Icon size={20} className="text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};
