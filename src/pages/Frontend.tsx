import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "orchestration", label: "Orchestration (main.py)", href: "#orchestration" },
  { id: "analysis-module", label: "Analysis Module (month.py)", href: "#analysis-module" },
  { id: "planning-module", label: "Planning Module (plan.py)", href: "#planning-module" },
  { id: "testing", label: "Testing Strategy", href: "#testing" },
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
          The `main.py` file is the central hub of Nova. Its most critical feature is the LLM-powered router. When a user sends a message, `route_natural_language_query` sends it to Gemini with a carefully engineered prompt. This instructs the model to act as a router, classifying the user's intent and extracting key parameters into a structured JSON object. It also manages conversational context in threads, deciding whether a message is a follow-up or a new command.
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
    2.  Normalize market names...
    3.  If a query contains "week" or "wk"..., prioritize the 'weekly-review-by-number' tool.
    
    **TOOLS:**
    - 'monthly-review': For a whole month. Needs 'market', 'month_abbr', 'year'.
    - 'analyse-influencer': For a specific influencer. Needs 'influencer_name'.
    - 'plan': For future budget allocation. Needs 'market', 'month_abbr', 'year'.

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

      <DocSection title="Standard Analysis Module (month.py)" id="analysis-module">
        <DocContent>
          Modules like `month.py` and `influencer.py` handle specific analytical requests. They follow a two-step AI generation process. First, they call the Lyra backend to get structured JSON data. Second, they construct a new prompt for Gemini, embedding this clean data as context and asking the LLM to generate a natural language summary.
          <br/><br/>
          <strong>  Insight:</strong> This "fact-grounded generation" pattern is crucial for enterprise AI. It prevents the LLM from hallucinating or making up data by forcing it to base its analysis solely on the accurate, pre-calculated data provided from the Lyra backend. The AI is used for presentation and interpretation, not for calculation.
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
        <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack/blob/main/month.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View month.py on GitHub →</Button>
        </a>
      </DocSection>
      
      <DocSection title="Prescriptive Analytics Module (plan.py)" id="planning-module">
        <DocContent>
          The `plan.py` module elevates Nova from a descriptive analytics tool to a prescriptive one. It doesn't just report what happened; it recommends what to do next. The `run_strategic_plan` function orchestrates a complex workflow to generate a data-driven budget allocation plan.
          <br/><br/>
          <strong>  Insight:</strong> This module delivers immense business value. It directly translates data into actionable strategy. The function demonstrates a complex orchestration of multiple API calls, data filtering, a core allocation algorithm, and multi-format output generation (Slack message + Excel file), showcasing a complete, feature-rich vertical slice of the application.
        </DocContent>
        <CodeBlock
          title="plan.py - Strategic Planning Logic"
          language="python"
          code={`def run_strategic_plan(client, say, event, thread_ts, params, thread_context_store):
    # 1. Fetch target budget and actual spend from Lyra API
    target_data = query_api(UNIFIED_API_URL, {"source": "dashboard", ...})
    actual_data_response = query_api(UNIFIED_API_URL, {"source": "influencer_analytics", ...})
    
    # 2. Calculate remaining budget
    remaining_budget = target_budget - actual_spend
    
    # 3. Fetch available high-performing influencers from Lyra's tiers
    booked_names = {inf.get('influencer_name') for inf in booked_influencers}
    gold = fetch_tier_influencers(market, year, "gold", booked_names)
    silver = fetch_tier_influencers(market, year, "silver", booked_names)
    
    # 4. Run allocation algorithm to spend remaining budget optimally
    recs, total_allocated, tier_breakdown = allocate_budget_cascading_tiers(...)

    # 5. Generate and upload a detailed Excel report
    excel_buffer = create_excel_report(recs, ...)
    client.files_upload_v2(channel=channel_id, file=excel_buffer.getvalue(), ...)
    
    # 6. Generate an AI-powered summary of the plan for Slack
    prompt, report_text = create_llm_prompt(...)
    response = gemini_model.generate_content(prompt)
    say(text=report_text + "\\n" + response.text, thread_ts=thread_ts)`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack/blob/main/plan.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View plan.py on GitHub →</Button>
        </a>
      </DocSection>

      <DocSection title="Testing Strategy" id="testing">
        <DocContent>
          The frontend logic is validated with `pytest` and extensive use of mocking to isolate components and test complex interactions with external services like the Lyra API and the Gemini LLM.
          <br/><br/>
          <strong>  Insight:</strong> Testing an AI-driven, multi-service application is non-trivial. The presence of tests that mock external dependencies demonstrates an understanding of modern testing practices for complex systems and ensures that individual modules can be validated independently.
        </DocContent>
        <CodeBlock
          title="tests/test_plan.py"
          language="python"
          code={`def test_run_strategic_plan_success(mocker, mock_say, mock_client):
    # Arrange: Mock API responses for targets, actuals, and influencer tiers
    mock_target = {"monthly_detail": [{"month": "dec", "target_budget_clean": 100000}]}
    mock_actuals = {"monthly_data": [{"summary": {"total_spend_eur": 17000}, ...}]}
    mock_tier_data = {"gold": [{"influencer_name": "gold_inf", ...}]}
    
    # Mock the query_api utility to return the fake data
    mocker.patch("common.utils.query_api", side_effect=[mock_target, mock_actuals, mock_tier_data, ...])
    
    # Mock the LLM response
    mock_llm_response = mocker.Mock()
    mock_llm_response.text = "Strategic Insights here."
    mocker.patch("common.config.gemini_model.generate_content", return_value=mock_llm_response)

    # Act
    run_strategic_plan(mock_client, mock_say, event, "ts123", params, thread_context)

    # Assert
    assert mock_client.upload_called
    assert any("Strategic Insights here." in s for s in mock_say.said_text)
    assert "strategic_plan" in thread_context["ts123"]["type"]`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/NOVA-Slack/blob/main/tests/test_plan.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View tests/ on GitHub →</Button>
        </a>
      </DocSection>
    </DocLayout>
  );
}
