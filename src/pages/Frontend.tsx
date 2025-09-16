import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "orchestration", label: "Orchestration (main.py)", href: "#orchestration" },
  { id: "monthly-review", label: "Monthly Review (month.py)", href: "#monthly-review" },
  { id: "influencer-analysis", label: "Influencer Analysis (influencer.py)", href: "#influencer-analysis" },
  { id: "weekly-review", label: "Weekly Reviews (weekly.py)", href: "#weekly-review" },
  { id: "trend-analysis", label: "Trend Analysis (trend.py)", href: "#trend-analysis" },
  { id: "strategic-planning", label: "Strategic Planning (plan.py)", href: "#strategic-planning" },
];

export default function Frontend() {
  return (
    <DocLayout title="Nova: The Conversational Frontend" navigation={navigation}>
      <Link to="/" className="mb-8 inline-block">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Overview
        </Button>
      </Link>
      
      <DocSection title="Nova Overview" id="overview">
        <DocContent>
          Nova is the user-facing component of the platform, implemented as a sophisticated Slack bot using the Slack Bolt framework. It serves as an intelligent conversational interface, allowing users to query complex marketing data using natural language. Nova's primary innovation lies in its use of a Large Language Model (Google's Gemini) to understand user intent, fetch structured data from the Lyra backend, and then generate insightful, human-readable analysis. The application is modular, with each core capability handled by its own Python file, orchestrated by `main.py`.
        </DocContent>
      </DocSection>

      <DocSection title="Core Orchestration (main.py)" id="orchestration">
        <DocContent>
          The `main.py` file is the central hub of Nova. Its most critical feature is the LLM-powered router. When a user sends a message, `route_natural_language_query` sends it to Gemini with a carefully engineered prompt. This instructs the model to classify the user's intent and extract key parameters into a structured JSON object.
          <br/><br/>
          <strong>  Insight:</strong> Using an LLM as a router for intent classification and entity extraction is a modern, highly scalable approach. It's far more flexible and resilient to variations in user phrasing than traditional, brittle keyword or regex-based systems. The context handling in threads creates a seamless user experience.
        </DocContent>
        <CodeBlock
          title="main.py - LLM Router Prompt"
          language="python"
          code={`def route_natural_language_query(query: str):
    prompt = f"""
    You are an expert routing assistant. Map a user query to a tool and extract parameters.

    **RULES:**
    1.  Default 'year' to '2025' if not specified.
    2.  If a query contains "week"..., you MUST prioritize the 'weekly-review-by-number' tool.
    
    **TOOLS:**
    - 'monthly-review': Needs 'market', 'month_abbr', 'year'.
    - 'analyse-influencer': Needs 'influencer_name'.
    - 'plan': Needs 'market', 'month_abbr', 'year'.

    **RESPONSE FORMAT:** JSON ONLY: '{{"tool_name": "...", "parameters": {{...}}}}'
    **USER QUERY:** "{query}"
    """
    response = gemini_model.generate_content(prompt)
    return json.loads(response.text.strip().replace("'''json", "").replace("'''", ""))`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack/blob/main/main.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View main.py on GitHub →</Button>
        </a>
      </DocSection>

      <DocSection title="Monthly Review (month.py)" id="monthly-review">
        <DocContent>
          This module handles requests for monthly performance reviews. It orchestrates calls to two different `sources` in the Lyra backend to gather both target and actual performance data. It then uses the "fact-grounded generation" pattern to produce a reliable AI summary.
           <br/><br/>
          <strong>  Insight:</strong> This two-step AI process is a key architectural pattern. The system uses the LLM for what it's best at—natural language generation and summarization—while relying on the robust, deterministic Lyra backend for all calculations. This prevents factual errors and hallucinations.
        </DocContent>
        <CodeBlock
          title="month.py - Fetching Data and Constructing Lyra Payload"
          language="python"
          code={`def run_monthly_review(say, thread_ts, params, thread_context_store, user_query=None):
    market, month_abbr, month_full, year = params['market'], params['month_abbr'], params['month_full'], params['year']

    # 1. Fetch target data from 'dashboard' source
    target_payload = {"source": "dashboard", "filters": {"market": market, "year": year}}
    target_data = query_api(UNIFIED_API_URL, target_payload, "Dashboard (Targets)")
    
    # 2. Fetch actuals data from 'influencer_analytics' source
    actuals_payload = {"source": "influencer_analytics", "view": "monthly_breakdown", "filters": {"market": market, "month": month_full, "year": year}}
    actual_data_response = query_api(UNIFIED_API_URL, actuals_payload, "Influencer Analytics (Monthly)")

    # ... data processing ...

    # 3. Generate AI response with fetched data as context
    prompt = create_prompt(user_query, market, month_full, year, target_budget_local, actual_data, is_full_review)
    response = gemini_model.generate_content(prompt)
    # ...`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack/blob/main/month.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View month.py on GitHub →</Button>
        </a>
      </DocSection>
      
      <DocSection title="Influencer Analysis (influencer.py)" id="influencer-analysis">
        <DocContent>
          This module provides deep dives on a single influencer. It constructs a targeted payload for Lyra and dynamically adjusts the verbosity of its AI-generated report based on the user's initial query, providing either a full deep-dive or a concise answer.
        </DocContent>
        <CodeBlock
          title="influencer.py - Fetching Data for a Specific Influencer"
          language="python"
          code={`def run_influencer_analysis(say, thread_ts, params, thread_context_store, user_query=None):
    influencer_name = params['influencer_name']
    filters = {"influencer_name": influencer_name}
    if 'year' in params and params['year']: filters['year'] = params['year']

    # Construct payload with 'influencer_name' filter for Lyra
    payload = {"source": "influencer_analytics", "view": "influencer_performance", "filters": filters}
    api_data = query_api(UNIFIED_API_URL, payload, "Influencer Analytics")

    # ... data processing ...
    
    is_deep_dive = not user_query or any(kw in user_query.lower() for kw in ["deep dive", "details", "analyse"])
    prompt = create_prompt(user_query, influencer_name, summary_stats, campaigns, is_deep_dive)
    # ...`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack/blob/main/influencer.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View influencer.py on GitHub →</Button>
        </a>
      </DocSection>

      <DocSection title="Weekly Reviews (weekly.py)" id="weekly-review">
        <DocContent>
          The `weekly.py` module handles two distinct types of user requests, intelligently differentiated by the `main.py` router: reviews by a specific week number, and reviews for a custom date range. Each function calls a different `view` in the Lyra backend.
        </DocContent>
        <CodeBlock
          title="weekly.py - Fetching Data for a Custom Date Range"
          language="python"
          code={`def run_weekly_review_by_range(say, thread_ts, params, thread_context_store, user_query=None):
    market, start_date, end_date = params['market'], params['start_date'], params['end_date']

    # Lyra payload for the 'custom_range_breakdown' view
    payload = {
        "source": "influencer_analytics", 
        "view": "custom_range_breakdown", 
        "filters": {"market": market, "date_from": start_date, "date_to": end_date}
    }
    api_data = query_api(UNIFIED_API_URL, payload, "Date Range Breakdown")
    # ...`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack/blob/main/weekly.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View weekly.py on GitHub →</Button>
        </a>
      </DocSection>

      <DocSection title="Trend Analysis (trend.py)" id="trend-analysis">
        <DocContent>
          This module generates leaderboard-style reports. It calls Lyra's `discovery_tiers` view and then programmatically formats the data into clean, text-based tables for Slack.
          <br/><br/>
          <strong>  Insight:</strong> This module demonstrates pragmatic design choices. Instead of using an LLM to generate a table (which can be unreliable), it uses Python's string formatting for a deterministic, perfectly structured output. It uses the right tool for the job.
        </DocContent>
        <CodeBlock
          title="trend.py - Generating Formatted Leaderboards"
          language="python"
          code={`def run_influencer_trend(say, thread_ts, params, thread_context_store, user_query=None):
    filters = {k: v for k, v in params.items() if k in ['market', 'year', 'month_full', 'tier']}
        
    payload = {"source": "influencer_analytics", "view": "discovery_tiers", "filters": filters}
    data = query_api(UNIFIED_API_URL, payload, "Influencer Trends")

    # ... combine tiers into a single list ...
        
    leaderboards = create_leaderboard_reports(all_influencers, filters)
    for report_text in leaderboards.values():
        say(text=report_text, thread_ts=thread_ts)`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack/blob/main/trend.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View trend.py on GitHub →</Button>
        </a>
      </DocSection>
      
      <DocSection title="Strategic Planning (plan.py)" id="strategic-planning">
        <DocContent>
          The `plan.py` module is the platform's most advanced feature, providing prescriptive analytics. It orchestrates multiple API calls to Lyra to build a comprehensive picture of the current budget situation and available talent, then runs a custom allocation algorithm to recommend how to spend the remaining budget.
          <br/><br/>
          <strong>  Insight:</strong> This module delivers immense business value by translating data directly into actionable strategy. The function demonstrates a complex orchestration of multiple API calls, data filtering, a core allocation algorithm, and multi-format output generation (Slack message + Excel file), showcasing a complete, feature-rich vertical slice of the application.
        </DocContent>
        <CodeBlock
          title="plan.py - Strategic Planning Orchestration"
          language="python"
          code={`def run_strategic_plan(client, say, event, thread_ts, params, thread_context_store):
    # 1. Fetch budget, spend, and booked influencer data from Lyra
    target_data = query_api(...)
    actual_data_response = query_api(...)
    
    # 2. Calculate remaining budget
    remaining_budget = target_budget - actual_spend
    
    # 3. Fetch available high-performing influencers from Lyra's tiers
    booked_names = {inf.get('influencer_name') for inf in booked_influencers}
    gold = fetch_tier_influencers(market, year, "gold", booked_names)
    # ...
    
    # 4. Run allocation algorithm to spend remaining budget optimally
    recs, total_allocated, tier_breakdown = allocate_budget_cascading_tiers(...)

    # 5. Generate and upload a detailed Excel report
    excel_buffer = create_excel_report(recs, ...)
    client.files_upload_v2(...)
    
    # 6. Generate an AI-powered summary of the plan for Slack
    prompt, report_text = create_llm_prompt(...)
    # ...`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack/blob/main/plan.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View plan.py on GitHub →</Button>
        </a>
      </DocSection>
    </DocLayout>
  );
}
