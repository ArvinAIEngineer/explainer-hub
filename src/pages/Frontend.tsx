import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "core-logic", label: "Core Logic (main.py)", href: "#core-logic" },
  { id: "monthly-module", label: "Monthly Module (month.py)", href: "#monthly-module" },
  { id: "influencer-module", label: "Influencer Module (influencer.py)", href: "#influencer-module" },
  { id: "planning-module", label: "Planning Module (plan.py)", href: "#planning-module" },
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

      <DocSection title="Core Logic (main.py)" id="core-logic">
        <DocContent>
          The `main.py` file is the central hub of Nova. Its most critical feature is the LLM-powered router. When a user sends a message, the `route_natural_language_query` function sends it to Gemini with a prompt that instructs the model to classify the intent and extract key parameters into a structured JSON object. This is far more flexible and powerful than traditional keyword-based command handling. It also manages conversational context in threads, deciding whether a message is a follow-up or a new command.
        </DocContent>
        <CodeBlock
          title="main.py - LLM Router Prompt"
          language="python"
          code={`def route_natural_language_query(query: str):
    prompt = f"""
    You are an expert routing assistant. Map a user query to a tool and extract parameters.

    **RULES:**
    1.  Default 'year' to '2025' if not specified.
    2.  Normalize market names: "UK" should be "UK". Others should be Sentence Case.
    3.  If a query contains "week" or "wk" followed by a number, you MUST prioritize the 'weekly-review-by-number' tool.
    
    **TOOLS:**
    - 'monthly-review': For a whole month. Needs 'market', 'month_abbr', 'year'.
    - 'analyse-influencer': For a specific influencer. Needs 'influencer_name'.
    - 'plan': For future budget allocation. Needs 'market', 'month_abbr', 'year'.

    **RESPONSE FORMAT:** JSON ONLY: '{"tool_name": "...", "parameters": {{...}}}'
    **USER QUERY:** "{query}"
    """
    response = gemini_model.generate_content(prompt)
    # ... parsing logic ...
    return json.loads(cleaned_text)
`}
        />
      </DocSection>

      <DocSection title="Monthly Review Module (month.py)" id="monthly-module">
        <DocContent>
          This module handles requests for monthly performance reviews. It follows a two-step AI generation process. First, it calls the Lyra backend to get structured JSON data for the requested month and market. Second, it constructs a new prompt for Gemini, embedding this clean data as context and asking the LLM to generate a natural language summary. This ensures the AI's response is grounded in factual, accurate data.
        </DocContent>
        <CodeBlock
          title="month.py - Analysis Generation Prompt"
          language="python"
          code={`def create_prompt(user_query, market, month, year, target_budget_local, actual_data, is_full_review):
    return f"""
    You are Nova, a marketing analyst.
    {"Generate a comprehensive monthly performance review." if is_full_review else "Provide a concise, direct answer."}
    **Data Context for {market.upper()} - {month.upper()} {year}:**
    {json.dumps({"Target Budget": format_currency(target_budget_local, market), "Actuals": actual_data}, indent=2)}
    **User's Request:** "{user_query if user_query else "A full monthly review."}"
    **Instructions:** Analyze the request and data. Formulate a clear, well-structured response using bold for key metrics. Present insights naturally without mentioning "based on the data provided".
    """
`}
        />
      </DocSection>
      
      <DocSection title="Influencer Analysis Module (influencer.py)" id="influencer-module">
        <DocContent>
          This module provides detailed performance data for a specific influencer. It dynamically adjusts its output based on the user's query. If the user asks a general question like "analyse influencer X," it generates a comprehensive deep-dive report. If the user asks a specific question, it provides a concise, direct answer, all powered by the same underlying data from Lyra.
        </DocContent>
      </DocSection>

      <DocSection title="Strategic Planning Module (plan.py)" id="planning-module">
        <DocContent>
          This module showcases Nova's most advanced capability: prescriptive analytics. It goes beyond reporting past performance to recommend future actions. The `run_strategic_plan` function orchestrates a complex workflow: it fetches budget and spending data, identifies already-booked influencers, queries Lyra for available high-performers, and then runs a budget allocation algorithm to create an optimized plan. The output includes both an AI-generated strategic summary in Slack and a detailed Excel file for download.
        </DocContent>
        <CodeBlock
          title="plan.py - Strategic Planning Logic"
          language="python"
          code={`def run_strategic_plan(client, say, event, thread_ts, params, thread_context_store):
    # 1. Fetch target budget and actual spend from Lyra API
    target_budget = ...
    actual_spend = ...
    remaining_budget = target_budget - actual_spend
    
    if remaining_budget <= 0:
        say("Budget is fully utilized.", thread_ts=thread_ts)
        return

    # 2. Fetch available influencers from Gold, Silver, and Bronze tiers
    gold, silver, bronze = fetch_tier_influencers(market, year, "gold", booked_names)
    
    # 3. Allocate remaining budget to the best available influencers
    recs, total_allocated, tier_breakdown = allocate_budget_cascading_tiers(...)

    # 4. Generate an Excel report for download
    excel_buffer = create_excel_report(recs, ...)
    client.files_upload_v2(channel=channel_id, file=excel_buffer.getvalue(), ...)
    
    # 5. Generate an AI-powered summary of the plan
    prompt, report_text = create_llm_prompt(...)
    response = gemini_model.generate_content(prompt)
    say(text=report_text + "\\n" + response.text, thread_ts=thread_ts)`}
        />
      </DocSection>
    </DocLayout>
  );
}
