import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "n8n-workflows", label: "n8n Workflows", href: "#n8n-workflows" },
  { id: "json-processing", label: "JSON Processing", href: "#json-processing" },
  { id: "data-transformations", label: "Data Transformations", href: "#data-transformations" },
];

export default function DataPipeline() {
  return (
    <DocLayout title="Data Pipeline Documentation" navigation={navigation}>
      <DocSection title="Data Pipeline Overview" id="overview">
        <DocContent>
          This section covers the data pipeline implementation using n8n for workflow automation 
          and JSON processing. The pipeline handles data ingestion, transformation, and routing 
          between different services in the system.
        </DocContent>
      </DocSection>

      <DocSection title="n8n Workflows" id="n8n-workflows">
        <DocContent>
          Our n8n workflows orchestrate the entire data flow. Here's the main workflow configuration:
        </DocContent>
        
        <CodeBlock
          title="workflow-config.json"
          language="json"
          code={`{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "/webhook/data-input",
        "responseMode": "onReceived",
        "options": {}
      },
      "name": "Data Input Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "functionCode": "// Process incoming data\\nconst inputData = items[0].json;\\n\\n// Transform and validate\\nconst processedData = {\\n  id: inputData.id || generateId(),\\n  timestamp: new Date().toISOString(),\\n  source: inputData.source,\\n  payload: inputData.payload\\n};\\n\\nreturn [{ json: processedData }];"
      },
      "name": "Data Processor",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [450, 300]
    }
  ],
  "connections": {
    "Data Input Webhook": {
      "main": [
        [
          {
            "node": "Data Processor",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`}
        />
      </DocSection>

      <DocSection title="JSON Processing" id="json-processing">
        <DocContent>
          JSON data processing utilities for handling various data formats and transformations:
        </DocContent>
        
        <CodeBlock
          title="json-processor.js"
          language="javascript"
          code={`class JSONProcessor {
  constructor() {
    this.validators = new Map();
    this.transformers = new Map();
  }

  // Register a custom validator
  addValidator(name, validatorFn) {
    this.validators.set(name, validatorFn);
  }

  // Register a custom transformer
  addTransformer(name, transformerFn) {
    this.transformers.set(name, transformerFn);
  }

  // Process JSON with validation and transformation
  async process(data, schema) {
    try {
      // Validate structure
      const isValid = this.validate(data, schema);
      if (!isValid) {
        throw new Error('JSON validation failed');
      }

      // Apply transformations
      const transformed = this.transform(data, schema.transformations);
      
      return {
        success: true,
        data: transformed,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  validate(data, schema) {
    // Custom validation logic
    return schema.required.every(field => data.hasOwnProperty(field));
  }

  transform(data, transformations) {
    return transformations.reduce((acc, transform) => {
      const transformer = this.transformers.get(transform.type);
      return transformer ? transformer(acc, transform.config) : acc;
    }, data);
  }
}`}
        />
      </DocSection>

      <DocSection title="Data Transformations" id="data-transformations">
        <DocContent>
          Common data transformation patterns used throughout the pipeline:
        </DocContent>
        
        <CodeBlock
          title="transformations.js"
          language="javascript"
          code={`// Common transformation functions
const transformations = {
  // Normalize field names
  normalizeFields: (data) => {
    const normalized = {};
    Object.keys(data).forEach(key => {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '_');
      normalized[normalizedKey] = data[key];
    });
    return normalized;
  },

  // Add metadata
  addMetadata: (data, metadata = {}) => {
    return {
      ...data,
      _metadata: {
        processed_at: new Date().toISOString(),
        version: '1.0',
        source: 'data-pipeline',
        ...metadata
      }
    };
  },

  // Filter sensitive data
  sanitize: (data, sensitiveFields = []) => {
    const sanitized = { ...data };
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    return sanitized;
  },

  // Validate and format dates
  processDates: (data) => {
    const processed = { ...data };
    Object.keys(processed).forEach(key => {
      if (key.includes('date') || key.includes('time')) {
        const date = new Date(processed[key]);
        if (!isNaN(date.getTime())) {
          processed[key] = date.toISOString();
        }
      }
    });
    return processed;
  }
};

module.exports = transformations;`}
        />
      </DocSection>
    </DocLayout>
  );
}