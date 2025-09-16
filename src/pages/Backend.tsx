import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "main-app", label: "Main Application", href: "#main-app" },
  { id: "api-endpoints", label: "API Endpoints", href: "#api-endpoints" },
  { id: "database", label: "Database Models", href: "#database" },
  { id: "middleware", label: "Middleware", href: "#middleware" },
];

export default function Backend() {
  return (
    <DocLayout title="FastAPI Backend Documentation" navigation={navigation}>
      <DocSection title="Backend Overview" id="overview">
        <DocContent>
          The backend is built as a single FastAPI file that handles all API endpoints, 
          database operations, and business logic. This monolithic approach keeps the 
          backend simple and easy to deploy while maintaining good separation of concerns 
          through function organization.
        </DocContent>
      </DocSection>

      <DocSection title="Main Application Structure" id="main-app">
        <DocContent>
          Here's the main FastAPI application setup with all dependencies and configuration:
        </DocContent>
        
        <CodeBlock
          title="main.py"
          language="python"
          code={`from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import asyncio
from datetime import datetime
import logging

# Initialize FastAPI app
app = FastAPI(
    title="Code Documentation API",
    description="Backend API for the code documentation system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
class DocumentRequest(BaseModel):
    title: str
    content: str
    category: str
    tags: List[str] = []

class DocumentResponse(BaseModel):
    id: int
    title: str
    content: str
    category: str
    tags: List[str]
    created_at: datetime
    updated_at: datetime

class UserModel(BaseModel):
    username: str
    email: str
    role: str = "user"

# In-memory storage (replace with database in production)
documents_db = []
users_db = []
document_id_counter = 1

@app.on_event("startup")
async def startup_event():
    logger.info("Starting FastAPI application")
    # Initialize any startup tasks here

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down FastAPI application")
    # Cleanup tasks here`}
        />
      </DocSection>

      <DocSection title="API Endpoints" id="api-endpoints">
        <DocContent>
          Core API endpoints for document management and user operations:
        </DocContent>
        
        <CodeBlock
          title="API Routes"
          language="python"
          code={`# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

# Document endpoints
@app.post("/api/documents", response_model=DocumentResponse)
async def create_document(
    document: DocumentRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    global document_id_counter
    
    new_document = {
        "id": document_id_counter,
        "title": document.title,
        "content": document.content,
        "category": document.category,
        "tags": document.tags,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    documents_db.append(new_document)
    document_id_counter += 1
    
    logger.info(f"Created document: {new_document['id']}")
    return new_document

@app.get("/api/documents", response_model=List[DocumentResponse])
async def get_documents(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    limit: int = 100
):
    filtered_docs = documents_db
    
    if category:
        filtered_docs = [doc for doc in filtered_docs if doc["category"] == category]
    
    if tag:
        filtered_docs = [doc for doc in filtered_docs if tag in doc["tags"]]
    
    return filtered_docs[:limit]

@app.get("/api/documents/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int):
    document = next((doc for doc in documents_db if doc["id"] == document_id), None)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@app.put("/api/documents/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: int,
    document_update: DocumentRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    document = next((doc for doc in documents_db if doc["id"] == document_id), None)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    document.update({
        "title": document_update.title,
        "content": document_update.content,
        "category": document_update.category,
        "tags": document_update.tags,
        "updated_at": datetime.now()
    })
    
    logger.info(f"Updated document: {document_id}")
    return document

@app.delete("/api/documents/{document_id}")
async def delete_document(
    document_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    global documents_db
    documents_db = [doc for doc in documents_db if doc["id"] != document_id]
    logger.info(f"Deleted document: {document_id}")
    return {"message": "Document deleted successfully"}`}
        />
      </DocSection>

      <DocSection title="Database Models" id="database">
        <DocContent>
          Database models and data access patterns (currently using in-memory storage):
        </DocContent>
        
        <CodeBlock
          title="Database Operations"
          language="python"
          code={`# Database utility functions
class DatabaseManager:
    def __init__(self):
        self.documents = []
        self.users = []
        self.categories = []
    
    async def create_document(self, document_data: dict) -> dict:
        """Create a new document in the database"""
        document_data["id"] = len(self.documents) + 1
        document_data["created_at"] = datetime.now()
        document_data["updated_at"] = datetime.now()
        
        self.documents.append(document_data)
        return document_data
    
    async def get_documents_by_category(self, category: str) -> List[dict]:
        """Retrieve documents by category"""
        return [doc for doc in self.documents if doc.get("category") == category]
    
    async def search_documents(self, query: str) -> List[dict]:
        """Search documents by title or content"""
        query_lower = query.lower()
        return [
            doc for doc in self.documents 
            if query_lower in doc.get("title", "").lower() 
            or query_lower in doc.get("content", "").lower()
        ]
    
    async def get_document_stats(self) -> dict:
        """Get database statistics"""
        categories = {}
        for doc in self.documents:
            category = doc.get("category", "uncategorized")
            categories[category] = categories.get(category, 0) + 1
        
        return {
            "total_documents": len(self.documents),
            "total_users": len(self.users),
            "categories": categories,
            "last_updated": max([doc["updated_at"] for doc in self.documents]) if self.documents else None
        }

# Initialize database manager
db_manager = DatabaseManager()

# Database dependency
async def get_database():
    return db_manager`}
        />
      </DocSection>

      <DocSection title="Middleware & Utilities" id="middleware">
        <DocContent>
          Custom middleware for authentication, logging, and error handling:
        </DocContent>
        
        <CodeBlock
          title="Middleware"
          language="python"
          code={`from fastapi import Request, Response
from fastapi.responses import JSONResponse
import time
import uuid

# Request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

# Logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    logger.info(f"Request: {request.method} {request.url}")
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} - {process_time:.4f}s")
    
    return response

# Error handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "request_id": getattr(request.state, "request_id", None)
        }
    )

# Authentication utility
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token (simplified for demo)"""
    token = credentials.credentials
    
    # In production, verify JWT token properly
    if not token or token == "invalid":
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"user_id": "demo_user", "role": "admin"}

# Run the application
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )`}
        />
      </DocSection>
    </DocLayout>
  );
}