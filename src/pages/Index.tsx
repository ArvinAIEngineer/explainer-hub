import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";

const Index = () => {
  const sampleCode1 = `// Multi-agent system configuration
const agentConfig = {
  coordinator: {
    name: "TaskCoordinator",
    role: "orchestrate",
    capabilities: ["planning", "delegation", "monitoring"]
  },
  workers: [
    {
      name: "DataProcessor",
      role: "process",
      capabilities: ["etl", "validation", "transformation"]
    },
    {
      name: "APIAgent",
      role: "communicate",
      capabilities: ["rest", "graphql", "websocket"]
    }
  ]
};

export default agentConfig;`;

  const sampleCode2 = `class AgentEngine {
  constructor(config) {
    this.agents = new Map();
    this.messageQueue = new EventEmitter();
    this.config = config;
  }

  async initializeAgents() {
    // Create coordinator agent
    const coordinator = new Agent(this.config.coordinator);
    this.agents.set('coordinator', coordinator);
    
    // Create worker agents
    for (const workerConfig of this.config.workers) {
      const worker = new Agent(workerConfig);
      this.agents.set(workerConfig.name, worker);
    }
    
    // Setup communication channels
    this.setupMessageRouting();
  }

  setupMessageRouting() {
    this.messageQueue.on('task', (task) => {
      const coordinator = this.agents.get('coordinator');
      coordinator.handleTask(task);
    });
  }
}`;

  const sampleCode3 = `// Deployment configuration for Google Cloud
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-engine
  labels:
    app: agent-engine
spec:
  replicas: 3
  selector:
    matchLabels:
      app: agent-engine
  template:
    metadata:
      labels:
        app: agent-engine
    spec:
      containers:
      - name: agent-engine
        image: gcr.io/project/agent-engine:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url`;

  return (
    <DocLayout title="Multi-Agent System Documentation">
      <DocSection title="Deploying a Multi-Agent System in Agent Engine" id="overview">
        <DocContent>
          <p className="text-lg leading-8 mb-6">
            In this comprehensive guide, we'll walk through the process of deploying a sophisticated 
            multi-agent system using Agent Engine on Google Cloud Platform. This system demonstrates 
            how multiple AI agents can work together to solve complex problems through coordinated 
            task distribution and real-time communication.
          </p>
          
          <p className="mb-4">
            Multi-agent systems represent a paradigm shift in how we approach distributed computing 
            and AI problem-solving. Rather than relying on a single monolithic system, we can 
            leverage multiple specialized agents, each with distinct capabilities and responsibilities.
          </p>
        </DocContent>
      </DocSection>

      <DocSection title="System Architecture Overview" id="getting-started">
        <DocContent>
          <p className="mb-4">
            Our multi-agent system consists of three main components: a coordinator agent that 
            orchestrates tasks, and multiple worker agents that handle specific functionalities. 
            Let's start by examining the basic configuration structure:
          </p>
        </DocContent>

        <CodeBlock 
          code={sampleCode1}
          language="javascript"
          title="agent-config.js"
        />

        <DocContent>
          <p className="mb-4">
            The configuration above defines our agent hierarchy. The <code className="bg-code-bg px-2 py-1 rounded text-syntax-keyword">coordinator</code> 
            agent acts as the central orchestrator, while worker agents handle specialized tasks like 
            data processing and API communication.
          </p>
          
          <p className="mb-4">
            Each agent has defined <code className="bg-code-bg px-2 py-1 rounded text-syntax-string">capabilities</code> 
            that determine what types of tasks they can handle. This modular approach allows for 
            easy scaling and maintenance of the system.
          </p>
        </DocContent>
      </DocSection>

      <DocSection title="Implementing the Agent Engine" id="examples">
        <DocContent>
          <p className="mb-4">
            Now let's implement the core AgentEngine class that will manage our multi-agent system. 
            This class handles agent initialization, message routing, and task coordination:
          </p>
        </DocContent>

        <CodeBlock 
          code={sampleCode2}
          language="javascript"
          title="AgentEngine.js"
        />

        <DocContent>
          <p className="mb-4">
            The <code className="bg-code-bg px-2 py-1 rounded text-syntax-function">AgentEngine</code> class 
            serves as the backbone of our system. Here's what each method does:
          </p>
          
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Constructor:</strong> Initializes the engine with configuration and sets up core data structures</li>
            <li><strong>initializeAgents():</strong> Creates and configures all agents based on the provided configuration</li>
            <li><strong>setupMessageRouting():</strong> Establishes communication channels between agents</li>
          </ul>

          <p className="mb-4">
            The use of <code className="bg-code-bg px-2 py-1 rounded text-syntax-keyword">EventEmitter</code> 
            for the message queue ensures that agents can communicate asynchronously, which is crucial 
            for maintaining system responsiveness under load.
          </p>
        </DocContent>
      </DocSection>

      <DocSection title="Deployment Configuration" id="api">
        <DocContent>
          <p className="mb-4">
            Finally, let's look at how to deploy this system to Google Cloud using Kubernetes. 
            The following configuration ensures scalability and reliability in production:
          </p>
        </DocContent>

        <CodeBlock 
          code={sampleCode3}
          language="yaml"
          title="deployment.yaml"
        />

        <DocContent>
          <p className="mb-4">
            This Kubernetes deployment configuration includes several important features:
          </p>
          
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Replicas:</strong> We deploy 3 instances for high availability</li>
            <li><strong>Environment Variables:</strong> Proper configuration for production deployment</li>
            <li><strong>Secrets Management:</strong> Secure handling of sensitive data like Redis URLs</li>
            <li><strong>Port Configuration:</strong> Exposing the service on port 8080</li>
          </ul>

          <p className="mb-6">
            To deploy this system, simply apply the configuration using:
          </p>

          <div className="bg-code-bg border border-code-border rounded-lg p-4 mb-6">
            <code className="text-code-foreground font-mono">kubectl apply -f deployment.yaml</code>
          </div>

          <p className="mb-4">
            This deployment strategy ensures that your multi-agent system can handle production 
            workloads while maintaining fault tolerance and scalability. The agents will 
            automatically discover each other and begin coordinating tasks according to your 
            configuration.
          </p>
        </DocContent>
      </DocSection>
    </DocLayout>
  );
};

export default Index;
