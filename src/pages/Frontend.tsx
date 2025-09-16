import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "main-app", label: "Main App", href: "#main-app" },
  { id: "feature-1", label: "User Management", href: "#feature-1" },
  { id: "feature-2", label: "Message Handler", href: "#feature-2" },
  { id: "feature-3", label: "Channel Monitor", href: "#feature-3" },
  { id: "feature-4", label: "Additional Features", href: "#feature-4" },
];

export default function Frontend() {
  return (
    <DocLayout title="Slack Bolt Frontend Documentation" navigation={navigation}>
      <DocSection title="Frontend Overview" id="overview">
        <DocContent>
          The frontend is built using Slack Bolt framework with a modular architecture. 
          Each feature is implemented in its own Python file with a main.py orchestrating 
          all components. This approach ensures maintainability and allows for independent 
          development of features.
        </DocContent>
      </DocSection>

      <DocSection title="Main Application Entry Point" id="main-app">
        <DocContent>
          The main.py file initializes the Slack Bolt app and imports all feature modules:
        </DocContent>
        
        <CodeBlock
          title="main.py"
          language="python"
          code={`import os
import logging
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

# Import feature modules
from features.user_management import UserManagement
from features.message_handler import MessageHandler
from features.channel_monitor import ChannelMonitor
from features.file_processor import FileProcessor
from features.analytics import Analytics
from features.notifications import Notifications

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Slack Bolt app
app = App(
    token=os.environ.get("SLACK_BOT_TOKEN"),
    signing_secret=os.environ.get("SLACK_SIGNING_SECRET")
)

class SlackApp:
    def __init__(self, slack_app):
        self.app = slack_app
        self.features = {}
        self.initialize_features()
        
    def initialize_features(self):
        """Initialize all feature modules"""
        try:
            # Initialize feature instances
            self.features['user_management'] = UserManagement(self.app)
            self.features['message_handler'] = MessageHandler(self.app)
            self.features['channel_monitor'] = ChannelMonitor(self.app)
            self.features['file_processor'] = FileProcessor(self.app)
            self.features['analytics'] = Analytics(self.app)
            self.features['notifications'] = Notifications(self.app)
            
            logger.info("All features initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing features: {e}")
            raise

# Initialize and start the application
if __name__ == "__main__":
    slack_app = SlackApp(app)
    slack_app.start()`}
        />
      </DocSection>

      <DocSection title="Feature 1: User Management" id="feature-1">
        <DocContent>
          Handles user registration, authentication, and profile management within Slack:
        </DocContent>
        
        <CodeBlock
          title="features/user_management.py"
          language="python"
          code={`import json
from typing import Dict, List
from slack_bolt import BoltRequest
from datetime import datetime

class UserManagement:
    def __init__(self, app):
        self.app = app
        self.users_db = {}  # In production, use proper database
        self.register_handlers()
    
    def register_handlers(self):
        """Register all user management related handlers"""
        
        # Handle user profile command
        @self.app.command("/profile")
        def handle_profile_command(ack, respond, command):
            ack()
            user_id = command['user_id']
            profile = self.get_user_profile(user_id)
            
            respond(f"👤 **Your Profile**\\n"
                   f"User ID: {profile.get('user_id', 'N/A')}\\n"
                   f"Role: {profile.get('role', 'Member')}\\n"
                   f"Joined: {profile.get('joined_date', 'Unknown')}")
    
    def register_user(self, user_id: str, user_name: str) -> Dict:
        """Register a new user in the system"""
        user_profile = {
            'user_id': user_id,
            'user_name': user_name,
            'role': 'member',
            'joined_date': datetime.now().isoformat(),
            'preferences': {
                'notifications': True,
                'analytics_opt_in': True
            }
        }
        
        self.users_db[user_id] = user_profile
        return user_profile`}
        />
      </DocSection>

      <DocSection title="Feature 2: Message Handler" id="feature-2">
        <DocContent>
          Processes and responds to different types of messages in Slack channels:
        </DocContent>
        
        <CodeBlock
          title="features/message_handler.py"
          language="python"
          code={`import re
from typing import Dict, List, Optional
from datetime import datetime

class MessageHandler:
    def __init__(self, app):
        self.app = app
        self.message_patterns = {}
        self.auto_responses = {}
        self.register_handlers()
        self.setup_patterns()
    
    def register_handlers(self):
        """Register message event handlers"""
        
        # Handle mentions
        @self.app.event("app_mention")
        def handle_app_mention(event, say):
            message = event['text']
            user = event['user']
            channel = event['channel']
            
            response = self.process_mention(message, user, channel)
            if response:
                say(response)
        
        # Handle direct messages
        @self.app.message("hello")
        def handle_hello(message, say):
            say(f"Hello <@{message['user']}>! 👋 How can I help you today?")
    
    def process_mention(self, message: str, user_id: str, channel_id: str) -> Optional[str]:
        """Process app mentions and generate appropriate responses"""
        message_lower = message.lower()
        
        # Check for specific patterns
        for pattern_name, pattern in self.message_patterns.items():
            if pattern.search(message):
                return self.get_pattern_response(pattern_name, message, user_id)
        
        # Default response for unmatched mentions
        return f"Thanks for mentioning me, <@{user_id}>! Use 'help' to see what I can do. 🤖"`}
        />
      </DocSection>

      <DocSection title="Feature 3: Channel Monitor" id="feature-3">
        <DocContent>
          Monitors channel activity and provides insights on usage patterns:
        </DocContent>
        
        <CodeBlock
          title="features/channel_monitor.py"
          language="python"
          code={`from datetime import datetime, timedelta
from typing import Dict, List
import json

class ChannelMonitor:
    def __init__(self, app):
        self.app = app
        self.channel_stats = {}
        self.activity_log = []
        self.register_handlers()
    
    def register_handlers(self):
        """Register channel monitoring handlers"""
        
        # Monitor all messages for statistics
        @self.app.event("message")
        def track_message_activity(event):
            if event.get('subtype') is None:  # Ignore bot messages and subtypes
                self.log_activity(event)
        
        # Channel stats command
        @self.app.command("/channel_stats")
        def handle_channel_stats(ack, respond, command):
            ack()
            channel_id = command['channel_id']
            stats = self.get_channel_statistics(channel_id)
            respond(self.format_channel_stats(stats))
    
    def log_activity(self, event: Dict):
        """Log message activity for analysis"""
        activity_entry = {
            'timestamp': datetime.now().isoformat(),
            'channel': event.get('channel'),
            'user': event.get('user'),
            'message_type': 'message',
            'has_thread': 'thread_ts' in event,
            'has_files': 'files' in event,
            'message_length': len(event.get('text', ''))
        }
        
        self.activity_log.append(activity_entry)
        self.update_channel_stats(event.get('channel'), activity_entry)`}
        />
      </DocSection>

      <DocSection title="Additional Features" id="feature-4">
        <DocContent>
          File Processor, Analytics, and Notifications modules work together to provide comprehensive functionality:
        </DocContent>
        
        <CodeBlock
          title="features/file_processor.py"
          language="python"
          code={`class FileProcessor:
    def __init__(self, app):
        self.app = app
        self.register_handlers()
    
    def register_handlers(self):
        @self.app.event("file_shared")
        def handle_file_upload(event):
            # Process uploaded files
            pass`}
        />
        
        <CodeBlock
          title="features/analytics.py"
          language="python"
          code={`class Analytics:
    def __init__(self, app):
        self.app = app
        self.metrics = {}
    
    def track_event(self, event_type, data):
        # Track user interactions and generate insights
        pass`}
        />
        
        <CodeBlock
          title="features/notifications.py"
          language="python"
          code={`class Notifications:
    def __init__(self, app):
        self.app = app
        self.notification_queue = []
    
    def send_notification(self, user_id, message):
        # Send notifications to users
        pass`}
        />
      </DocSection>
    </DocLayout>
  );
}