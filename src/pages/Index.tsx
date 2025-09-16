import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server, MessageSquare, ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "architecture", label: "Architecture", href: "#architecture" },
  { id: "components", label: "Components", href: "#components" },
  { id: "tech-stack", label: "Technology Stack", href: "#tech-stack" },
];

export default function Index() {
  return (
    <DocLayout title="Nova: AI-Powered Analytics Platform" navigation={navigation}>
      <DocSection title="System Overview" id="overview">
        <DocContent>
          Welcome to the documentation for Nova, an end-to-end, AI-powered data analytics platform. 
          This system is designed to automate the entire lifecycle of influencer marketing data—from ingestion and cleaning to complex analysis and conversational reporting directly within Slack.
        </DocContent>
      </DocSection>

      <DocSection title="System Architecture" id="architecture">
        <DocContent>
          The platform is built on a robust, three-tiered architecture that ensures a clear separation of concerns, scalability, and maintainability. The diagram below illustrates the end-to-end flow of data and interaction within the system.
        </DocContent>

        <div className="my-8 p-4 border border-border rounded-lg bg-muted/10 shadow-md">
          <img
            src="/architecture.png"
            alt="System Architecture Diagram"
            className="w-full rounded-md object-contain"
          />
          <p className="mt-4 text-center text-sm text-muted-foreground italic">
            End-to-end data flow from source ingestion to conversational AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card className="border-border bg-gradient-to-br from-card via-card to-muted/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-foreground">Data Pipeline</CardTitle>
              </div>
              <CardDescription>Google Sheets, n8n & Supabase</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A fully automated ETL process that extracts client data from Google Sheets, cleans it, and ingests it into a Supabase database daily via n8n workflows.
              </p>
              <Link to="/data-pipeline">
                <Button variant="outline" size="sm" className="w-full group">
                  View Pipeline Details 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-card via-card to-muted/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-secondary/20 to-primary/20">
                  <Server className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-foreground">Lyra: Analytics Engine</CardTitle>
              </div>
              <CardDescription>Python, Flask & Pandas Backend</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The computational core of the system. Lyra performs complex calculations, currency conversions, and data aggregations, exposing insights via a REST API.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link to="/backend">
                  <Button variant="outline" size="sm" className="w-full group">
                    View Backend Details 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="https://github.com/Arvin-BrandInfluencer/Lyra-Final" target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Github className="h-4 w-4 mr-2" />
                    View Full Code
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-card via-card to-muted/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-accent/20 to-secondary/20">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-foreground">Nova: Conversational Layer</CardTitle>
              </div>
              <CardDescription>Slack Bolt & Google Gemini</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                An intelligent Slack bot that understands natural language queries, fetches data from Lyra, and delivers AI-generated analysis and reports to users.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link to="/frontend">
                  <Button variant="outline" size="sm" className="w-full group">
                    View Frontend Details 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack" target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Github className="h-4 w-4 mr-2" />
                    View Full Code
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection title="Key Components & Features" id="components">
        <DocContent>
          Each component is packed with features designed for a seamless analytics experience:
        </DocContent>
        
        <div className="space-y-6 my-8">
          <div className="p-6 rounded-lg border border-border bg-gradient-to-r from-muted/10 to-muted/5">
            <h3 className="text-lg font-semibold text-foreground mb-3 bg-gradient-primary bg-clip-text text-transparent">
              🔄 Data Pipeline
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Automated data fetching from Google Sheets using `IMPORTRANGE`.</li>
              <li>• In-sheet data sanitization with `ARRAYFORMULA`.</li>
              <li>• Daily, scheduled data synchronization via n8n workflows.</li>
              <li>• Robust "delete-then-insert" logic to prevent data duplication.</li>
              <li>• Fault-tolerant ingestion by loading numerical data as strings, with post-processing via database triggers.</li>
            </ul>
          </div>
          
          <div className="p-6 rounded-lg border border-border bg-gradient-to-r from-muted/10 to-muted/5">
            <h3 className="text-lg font-semibold text-foreground mb-3 bg-gradient-primary bg-clip-text text-transparent">
              ⚡ Lyra (Backend)
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Centralized REST API built with Python and Flask.</li>
              <li>• Powerful data processing and transformations using the Pandas library.</li>
              <li>• Dynamic calculations: CAC, CTR, CVR, and trend analysis.</li>
              <li>• Automated currency conversion for multi-market (Nordics) reporting.</li>
              <li>• Performance-based influencer ranking into Gold, Silver, and Bronze tiers.</li>
            </ul>
          </div>
          
          <div className="p-6 rounded-lg border border-border bg-gradient-to-r from-muted/10 to-muted/5">
            <h3 className="text-lg font-semibold text-foreground mb-3 bg-gradient-primary bg-clip-text text-transparent">
              💬 Nova (Frontend)
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Natural Language Understanding (NLU) powered by Google's Gemini API.</li>
              <li>• Intelligent routing of user queries to the correct analysis "tool".</li>
              <li>• Context-aware conversations with follow-up question handling in threads.</li>
              <li>• AI-generated summaries and strategic reports.</li>
              <li>• Prescriptive analytics for future budget planning and influencer selection.</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Technology Stack" id="tech-stack">
        <DocContent>
          The platform leverages a modern and robust set of technologies to deliver its capabilities.
        </DocContent>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground">
            <strong>Data & Automation:</strong> Google Sheets, n8n, Supabase (PostgreSQL)<br/>
            <strong>Backend:</strong> Python, Flask, Pandas<br/>
            <strong>Conversational AI:</strong> Slack Bolt SDK, Google Gemini API<br/>
          </p>
        </div>
      </DocSection>
    </DocLayout>
  );
}
