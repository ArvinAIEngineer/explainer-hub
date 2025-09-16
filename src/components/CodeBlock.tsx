import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock = ({ code, language = "javascript", title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting for demo
  const highlightCode = (code: string) => {
    return code
      .replace(/\b(function|const|let|var|if|else|for|while|return|import|export|from|class|extends|async|await)\b/g, 
        '<span class="text-syntax-keyword font-semibold">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="text-syntax-string">\"$1\"</span>')
      .replace(/'([^']*)'/g, '<span class="text-syntax-string">\'$1\'</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-syntax-number">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-syntax-comment italic">$1</span>')
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="text-syntax-function">$1</span>(');
  };

  return (
    <div className="relative group my-6">
      {title && (
        <div className="flex items-center justify-between bg-content-bg border border-content-border rounded-t-lg px-4 py-2 border-b-0">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="bg-gradient-code border border-code-border rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
          <code 
            className="text-code-foreground font-mono"
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          />
        </pre>
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 border border-primary/20"
        >
          {copied ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Copy className="h-4 w-4 text-primary" />
          )}
        </Button>
      </div>
    </div>
  );
};