import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "architecture", label: "Architecture", href: "#architecture" },
  { id: "routes", label: "Routes (routes.py)", href: "#routes" },
  { id: "data-service", label: "Data Service (data_service.py)", href: "#data-service" },
  { id: "processing-service", label: "Processing Service (processing_service.py)", href: "#processing-service" },
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
          Lyra is the computational brain of the platform. It is a backend service built with Python, using the Flask web framework and the powerful Pandas library for data manipulation. Its primary role is not just to serve data, but to perform all the heavy lifting: pre-calculating complex metrics, aggregating data across different markets, and transforming raw numbers into structured, ready-to-consume insights for the Nova conversational layer.
        </DocContent>
      </DocSection>

      <DocSection title="Core Architecture" id="architecture">
        <DocContent>
          Lyra follows a clean, service-oriented architecture to maintain a strong separation of concerns. This makes the codebase modular, testable, and easy to maintain. The structure is divided into logical layers, each with a specific responsibility.
        </DocContent>
      </DocSection>
      
      <DocSection title="Routes Layer (app/routes.py)" id="routes">
        <DocContent>
          The routes layer defines the API surface. A key architectural choice was to use a single, unified endpoint (`/api/influencer/query`). This endpoint acts as a gateway, routing requests to the appropriate service based on the `source` parameter in the JSON payload. This simplifies the frontend integration significantly, as Nova only needs to construct different payloads for one endpoint.
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
      </DocSection>

      <DocSection title="Data Service Layer (app/services/data_service.py)" id="data-service">
        <DocContent>
          This layer is the bridge to the Supabase database. It abstracts away all database interactions, constructing and executing queries dynamically based on filters from the request payload. It queries pre-defined, performant SQL Views (e.g., `all_influencer_campaigns`) and returns the raw data as a Pandas DataFrame, ready for processing.
        </DocContent>
        <CodeBlock
          title="app/services/data_service.py"
          language="python"
          code={`def get_analytics_data(payload: Dict[str, Any]):
    """Fetches data for the analytics source and routes to processing."""
    logger.info("Starting analytics data request from view.")
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
      </DocSection>
      
      <DocSection title="Processing Service (app/services/processing_service.py)" id="processing-service">
        <DocContent>
          This is the core of Lyra's intelligence. It contains all business logic and uses Pandas to perform complex data transformations. It routes incoming DataFrames to the correct function based on the `view` parameter and executes calculations like multi-currency aggregation for Nordics markets and performance-based influencer tiering.
        </DocContent>
        <CodeBlock
          title="Processing Service - Request Routing"
          language="python"
          code={`def route_analytics_processing(df: pd.DataFrame, payload: Dict[str, Any]):
    """Cleans the analytics DataFrame and routes it to the correct processing function."""
    view = payload.get("view", "summary")
    filters = payload.get("filters", {})

    if "influencer_name" in filters:
        return _influencer_process_profile(df, filters.get("influencer_name"))
    if view == "summary":
        return _influencer_process_summary(df, payload)
    if view == "discovery_tiers":
        return _influencer_process_discovery_tiers(df, payload)
    # ... other views ...
    
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
      </DocSection>
    </DocLayout>
  );
}
