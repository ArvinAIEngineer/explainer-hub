import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocLayoutProps {
  children: ReactNode;
  title?: string;
  navigation?: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const DocLayout = ({ children, title = "Code Documentation", navigation = [] }: DocLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const defaultNavigation: NavItem[] = [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "getting-started", label: "Getting Started", href: "#getting-started" },
    { id: "examples", label: "Examples", href: "#examples" },
    { id: "api", label: "API Reference", href: "#api" },
  ];

  const navItems = navigation.length > 0 ? navigation : defaultNavigation;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-background/95 to-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-4 lg:hidden hover:bg-primary/20"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-hero">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              {title}
            </span>
          </div>
        </div>
      </header>

      <div className="container flex">
        {/* Sidebar */}
        <aside className={cn(
          "w-64 shrink-0 border-r border-border bg-gradient-to-b from-muted/20 to-muted/5 p-6",
          "lg:block",
          sidebarOpen ? "block" : "hidden"
        )}>
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                className="group block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 border border-transparent hover:border-primary/20"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <span className="group-hover:bg-gradient-accent group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};