import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "routes", label: "API Gateway (routes.py)", href: "#routes" },
  { id: "data-service", label: "Data Service (data_service.py)", href: "#data-service" },
  { id: "processing-service", label: "Processing Service (processing_service.py)", href: "#processing-service" },
  { id: "testing", label: "Testing Strategy", href: "#testing" },
];

export default function Backend() {
  return (
    <DocLayout title="Lyra: The Backend Analytics Engine" navigation={navigation}>
      <Link to="/" className="mb-8 inline-block">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Overview
        </Button>
      </Link>
      
      <DocSection title="Lyra Engine Overview" id="overview">
        <DocContent>
          Lyra is the computational brain of the platform. It is a backend service built with Python, using the Flask web framework and the powerful Pandas library for data manipulation. Its primary role is not just to serve data, but to perform all the heavy lifting: pre-calculating complex metrics, aggregating data across different markets, and transforming raw numbers into structured, ready-to-consume insights for the Nova conversational layer. The entire architecture is built on a test-driven, service-oriented design for maintainability and reliability.
        </DocContent>
      </DocSection>
      
      <DocSection title="API Gateway (app/routes.py)" id="routes">
        <DocContent>
          The routes layer defines the API surface. A key architectural choice was to use a single, unified endpoint (`/api/influencer/query`). This acts as a gateway that routes requests to the appropriate service based on the `source` parameter in the request payload.
          <br/><br/>
          <strong>CTO Insight:</strong> This single-endpoint design creates a stable API contract, simplifying frontend integration. It allows the backend to evolve and add new data `sources` or `views` without requiring changes to the endpoint URI, which enhances long-term maintainability.
        </DocContent>
        <CodeBlock
          title="app/routes.py"
          language="python"
          code={`@app.route('/api/influencer/query', methods=['POST'])
def handle_influencer_query():
    """Main query endpoint that routes requests based on the 'source' parameter."""
    try:
        payload = request.get_json(silent=True)
        source = payload.get("source")
        logger.info(f"Routing request for source: '{source}'")

        if source == "dashboard":
            result = data_service.get_dashboard_data(payload)
        elif source == "influencer_analytics":
            result = data_service.get_analytics_data(payload)
        else:
            result = {"error": f"Invalid 'source'."}
        
        return jsonify(result)

    except Exception as e:
        logger.critical(f"An unhandled exception occurred: {e}")
        return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/Lyra-Final/blob/main/app/routes.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View app/routes.py on GitHub →</Button>
        </a>
      </DocSection>

      <DocSection title="Data Service Layer (app/services/data_service.py)" id="data-service">
        <DocContent>
          This layer acts as the bridge to the Supabase database. It abstracts away all database interactions, constructing and executing queries dynamically based on filters from the request payload. It queries pre-defined, performant SQL Views (e.g., `all_influencer_campaigns`) for efficiency and returns the raw data as a Pandas DataFrame, ready for processing.
          <br/><br/>
          <strong>CTO Insight:</strong> This abstraction decouples the business logic from the data access mechanism. Querying views instead of raw tables is a best practice that improves security and performance.
        </DocContent>
        <CodeBlock
          title="app/services/data_service.py"
          language="python"
          code={`def get_analytics_data(payload: Dict[str, Any]):
    """Fetches data for the analytics source and routes to processing."""
    try:
        filters = payload.get("filters", {})
        query = supabase.from_(CAMPAIGN_VIEW_NAME).select("*")

        if influencer_name := filters.get("influencer_name"):
            query = query.ilike('influencer_name', f'%{influencer_name.strip()}%')
        if market := filters.get("market", "All"):
            if market != "All":
                markets_to_filter = NORDIC_COUNTRIES if market == "Nordics" else [market]
                query = query.in_('market', markets_to_filter)
        
        response = query.execute()
        df = pd.DataFrame(response.data)
        
        return processing_service.route_analytics_processing(df, payload)
    except Exception as e:
        return {"error": f"Influencer Analytics query failed: {str(e)}"}`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/Lyra-Final/blob/main/app/services/data_service.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View app/services/data_service.py on GitHub →</Button>
        </a>
      </DocSection>
      
      <DocSection title="Processing Service (app/services/processing_service.py)" id="processing-service">
        <DocContent>
          This is the core of Lyra's intelligence. It contains all business logic and uses Pandas for high-performance in-memory data transformation. The `route_analytics_processing` function acts as a sub-router, delegating the DataFrame to the appropriate analytical function based on the requested `view`. This module handles complex logic like multi-currency aggregation for Nordics markets and performance-based influencer tiering.
          <br/><br/>
          <strong>CTO Insight:</strong> This design follows the Strategy Pattern, where different analytical "strategies" (e.g., `_influencer_process_summary`, `_influencer_process_discovery_tiers`) can be added or modified without affecting the core data fetching logic. Using Pandas is ideal for this kind of vectorized computation and complex data manipulation.
        </DocContent>
        <CodeBlock
          title="Processing Service - Request Routing"
          language="python"
          code={`def route_analytics_processing(df: pd.DataFrame, payload: Dict[str, Any]):
    """Cleans the analytics DataFrame and routes it to the correct processing function."""
    view = payload.get("view", "summary")

    if "influencer_name" in payload.get("filters", {}):
        return _influencer_process_profile(df, payload["filters"]["influencer_name"])
    if view == "summary":
        return _influencer_process_summary(df, payload)
    if view == "discovery_tiers":
        return _influencer_process_discovery_tiers(df, payload)
    if view == "monthly_breakdown":
        return _influencer_process_monthly_breakdown(df)
    
    return {"error": f"Invalid view '{view}'."}`}
        />
        <CodeBlock
          title="Processing Service - Influencer Tiering Example"
          language="python"
          code={`def _influencer_process_discovery_tiers(df: pd.DataFrame, payload: dict):
    """Processes data for the discovery tiers view."""
    summary_result = _influencer_process_summary(df, {})
    grouped = pd.DataFrame(summary_result["items"])
    
    zero_cac = grouped[grouped['effective_cac_eur'] <= 0]
    ranked = grouped[grouped['effective_cac_eur'] > 0].sort_values(by='effective_cac_eur', ascending=True)
    count = len(ranked)
    
    top_third_index = math.ceil(count / 3)
    mid_third_index = math.ceil(count * 2 / 3)
    
    gold_df = ranked.iloc[:top_third_index]
    silver_df = ranked.iloc[top_third_index:mid_third_index]
    bronze_df = pd.concat([ranked.iloc[mid_third_index:], zero_cac])
    
    return { "gold": gold_df.to_dict(orient='records'), "silver": silver_df.to_dict(orient='records'), "bronze": bronze_df.to_dict(orient='records') }`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/Lyra-Final/blob/main/app/services/processing_service.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View app/services/processing_service.py on GitHub →</Button>
        </a>
      </DocSection>

      <DocSection title="Testing Strategy" id="testing">
        <DocContent>
          The backend is supported by a suite of unit tests using `pytest` and `pytest-mock`. The tests cover both the API routes (ensuring correct status codes and responses) and the complex data transformations in the processing service.
          <br/><br/>
          <strong>CTO Insight:</strong> A dedicated testing suite demonstrates a commitment to code quality, reliability, and maintainability. It proves the system is not just a prototype but a robust application ready for a CI/CD pipeline.
        </DocContent>
        <CodeBlock
          title="tests_backend/test_processing_service.py"
          language="python"
          code={`def test_process_dashboard_data_nordics():
    """Test Nordics aggregation which involves currency conversion."""
    raw_data = [
        {'month': 'Jan', 'region': 'Sweden', 'currency': 'SEK', 'target_budget_clean': 1130, 'actual_spend_clean': 1130, 'target_conversions_clean': 10, 'actual_conversions_clean': 5}, # 100 EUR
        {'month': 'Jan', 'region': 'Norway', 'currency': 'NOK', 'target_budget_clean': 1150, 'actual_spend_clean': 0, 'target_conversions_clean': 10, 'actual_conversions_clean': 0} # 100 EUR
    ]
    result = processing_service.process_dashboard_data(raw_data, "Nordics")
    
    # All values should be aggregated and in EUR
    assert result['kpi_summary']['target_budget'] == 200
    assert result['kpi_summary']['actual_spend'] == 100
    assert result['monthly_detail'][0]['currency'] == 'EUR'`}
        />
        <a href="https://github.com/Arvin-BrandInfluencer/Lyra-Final/blob/main/tests_backend/test_processing_service.py" target="_blank" rel="noopener noreferrer">
          <Button variant="link">View tests_backend/ on GitHub →</Button>
        </a>
      </DocSection>
    </DocLayout>
  );
}
