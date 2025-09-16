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
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-4 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
              {title}
            </span>
          </div>
        </div>
      </header>

      <div className="container flex">
        {/* Sidebar */}
        <aside className={cn(
          "w-64 shrink-0 border-r border-border bg-muted/10 p-6",
          "lg:block",
          sidebarOpen ? "block" : "hidden"
        )}>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {item.label}
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