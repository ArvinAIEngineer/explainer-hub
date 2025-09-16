import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "architecture", label: "Architecture", href: "#architecture" },
  { id: "components", label: "Components", href: "#components" },
  { id: "getting-started", label: "Getting Started", href: "#getting-started" },
];

export default function Index() {
  return (
    <DocLayout title="Code Documentation System" navigation={navigation}>
      <DocSection title="System Overview" id="overview">
        <DocContent>
          Welcome to the comprehensive documentation for our multi-component system. 
          This documentation covers three main components: Data Pipeline (n8n/JSON), 
          FastAPI Backend, and Slack Bolt Frontend with modular features.
        </DocContent>
      </DocSection>

      <DocSection title="System Architecture" id="architecture">
        <DocContent>
          Our system follows a microservices architecture with clear separation of concerns:
        </DocContent>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card className="border-border bg-gradient-to-br from-card via-card to-muted/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-foreground">Data Pipeline</CardTitle>
              </div>
              <CardDescription>n8n workflows with JSON processing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Handles data ingestion, transformation, and routing using n8n automation platform.
              </p>
              <Link to="/data-pipeline">
                <Button variant="outline" size="sm" className="w-full group">
                  View Details 
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
                <CardTitle className="text-foreground">Backend API</CardTitle>
              </div>
              <CardDescription>FastAPI single-file architecture</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                RESTful API built with FastAPI providing all backend functionality in a single file.
              </p>
              <Link to="/backend">
                <Button variant="outline" size="sm" className="w-full group">
                  View Details 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-card via-card to-muted/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-accent/20 to-secondary/20">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-foreground">Slack Frontend</CardTitle>
              </div>
              <CardDescription>Modular Slack Bolt application</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Slack bot with 6 independent features, each in separate Python files with main.py orchestration.
              </p>
              <Link to="/frontend">
                <Button variant="outline" size="sm" className="w-full group">
                  View Details 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection title="Key Components" id="components">
        <DocContent>
          Each component serves a specific purpose in the overall system:
        </DocContent>
        
        <div className="space-y-6 my-8">
          <div className="p-6 rounded-lg border border-border bg-gradient-to-r from-muted/10 to-muted/5">
            <h3 className="text-lg font-semibold text-foreground mb-3 bg-gradient-primary bg-clip-text text-transparent">
              🔄 Data Pipeline Features
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• n8n workflow automation and orchestration</li>
              <li>• JSON data processing and validation</li>
              <li>• Data transformation and routing</li>
              <li>• Error handling and monitoring</li>
            </ul>
          </div>
          
          <div className="p-6 rounded-lg border border-border bg-gradient-to-r from-muted/10 to-muted/5">
            <h3 className="text-lg font-semibold text-foreground mb-3 bg-gradient-primary bg-clip-text text-transparent">
              ⚡ Backend API Features
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• RESTful API endpoints for all operations</li>
              <li>• Authentication and authorization</li>
              <li>• Database models and operations</li>
              <li>• Middleware for logging and error handling</li>
            </ul>
          </div>
          
          <div className="p-6 rounded-lg border border-border bg-gradient-to-r from-muted/10 to-muted/5">
            <h3 className="text-lg font-semibold text-foreground mb-3 bg-gradient-primary bg-clip-text text-transparent">
              💬 Slack Frontend Features
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• User Management - Registration and profiles</li>
              <li>• Message Handler - Smart message processing</li>
              <li>• Channel Monitor - Activity tracking and analytics</li>
              <li>• File Processor - File upload and processing</li>
              <li>• Analytics - Usage metrics and insights</li>
              <li>• Notifications - User notification system</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Getting Started" id="getting-started">
        <DocContent>
          To explore the documentation for each component, use the navigation above or click the component cards. 
          Each section provides detailed code examples, API references, and implementation guides.
        </DocContent>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground">
            💡 <strong>Tip:</strong> Start with the component you're most interested in, or follow the data flow from 
            Data Pipeline → Backend → Frontend for a complete understanding of the system.
          </p>
        </div>
      </DocSection>
    </DocLayout>
  );
}
