import { ReactNode } from "react";

interface DocSectionProps {
  title?: string;
  children: ReactNode;
  id?: string;
}

export const DocSection = ({ title, children, id }: DocSectionProps) => {
  return (
    <section id={id} className="mb-8">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-foreground bg-gradient-primary bg-clip-text text-transparent">
          {title}
        </h2>
      )}
      <div className="prose prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
};

interface DocContentProps {
  children: ReactNode;
}

export const DocContent = ({ children }: DocContentProps) => {
  return (
    <div className="text-base leading-7 text-foreground/90 mb-6">
      {children}
    </div>
  );
};