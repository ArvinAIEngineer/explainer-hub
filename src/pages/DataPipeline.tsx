import { DocLayout } from "@/components/DocLayout";
import { DocSection, DocContent } from "@/components/DocSection";
import { CodeBlock } from "@/components/CodeBlock";

const navigation = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "stage-1-sheets", label: "Stage 1: Google Sheets", href: "#stage-1-sheets" },
  { id: "stage-2-n8n", label: "Stage 2: n8n Automation", href: "#stage-2-n8n" },
  { id: "stage-3-supabase", label: "Stage 3: Supabase Database", href: "#stage-3-supabase" },
];

export default function DataPipeline() {
  return (
    <DocLayout title="Data Pipeline Architecture" navigation={navigation}>
      <DocSection title="Pipeline Overview" id="overview">
        <DocContent>
          The data pipeline is the foundation of the entire system, responsible for the automated Extraction, Transformation, and Loading (ETL) of influencer marketing data. It ensures that clean, up-to-date information is available for analysis every day. The flow is designed for robustness and reliability, moving data seamlessly from a client-facing spreadsheet to our structured database.
        </DocContent>
      </DocSection>

      <DocSection title="Stage 1: Google Sheets (Source & Staging)" id="stage-1-sheets">
        <DocContent>
          The pipeline begins with a client's Google Sheet, which acts as the single source of truth. To isolate our system and pre-process the data, we use an intermediate "Upload Sheet". This sheet employs powerful Google Sheets formulas to perform the initial data extraction and cleaning.
          <br/><br/>
          The formula below uses `IMPORTRANGE` to fetch a range of data and a series of `IF` and `TRIM` checks to sanitize it, replacing common null-like values (e.g., "N/A", "-", "false") with `0`. It attempts to convert values to numbers but gracefully keeps them as text if the conversion fails, preventing errors downstream. This is a critical first-pass cleaning step that happens before the data even enters the automation workflow.
        </DocContent>
        
        <CodeBlock
          title="Google Sheet Formula Example"
          language="excel"
          code={`=ARRAYFORMULA(
  IF(
    IMPORTRANGE("1p0NNSuCxB-AmlklmmyKfiObOi3xHlXsO8g9DqXf-FLY", "Post_Tracker!B6:AZ")="",
    "",
    IF(
      (TRIM(IMPORTRANGE("1p0NNSuCxB-AmlklmmyKfiObOi3xHlXsO8g9DqXf-FLY", "Post_Tracker!B6:AZ"))="")+
      (TRIM(IMPORTRANGE("1p0NNSuCxB-AmlklmmyKfiObOi3xHlXsO8g9DqXf-FLY", "Post_Tracker!B6:AZ"))="FALSE")+
      (TRIM(IMPORTRANGE("1p0NNSuCxB-AmlklmmyKfiObOi3xHlXsO8g9DqXf-FLY", "Post_Tracker!B6:AZ"))="N/A")+
      ISERROR(IMPORTRANGE("1p0NNSuCxB-AmlklmmyKfiObOi3xHlXsO8g9DqXf-FLY", "Post_Tracker!B6:AZ")),
      0,
      IFERROR(
        VALUE(TRIM(IMPORTRANGE("1p0NNSuCxB-AmlklmmyKfiObOi3xHlXsO8g9DqXf-FLY", "Post_Tracker!B6:AZ"))),
        TRIM(IMPORTRANGE("1p0NNSuCxB-AmlklmmyKfiObOi3xHlXsO8g9DqXf-FLY", "Post_Tracker!B6:AZ"))
      )
    )
  )
)`}
        />
      </DocSection>

      <DocSection title="Stage 2: n8n Automation (The Engine)" id="stage-2-n8n">
        <DocContent>
          n8n is the orchestration layer that automates the data flow. A scheduled workflow runs at midnight every night to sync the data from our "Upload Sheet" to the Supabase database.
          <br/><br/>
          The workflow follows a robust "delete-then-insert" pattern. First, it triggers a `DELETE` operation on the target Supabase table to clear the previous day's data. It then reads all rows from the Google Sheet, transforms the data in a code node, and finally performs a bulk `INSERT` into Supabase. This ensures the database is always a perfect, up-to-date mirror of the source sheet.
        </DocContent>
        
        <CodeBlock
          title="n8n Workflow Simplified JSON"
          language="json"
          code={`{
  "name": "France 2025",
  "nodes": [
    { "name": "Schedule Trigger1", "type": "n8n-nodes-base.scheduleTrigger", "parameters": { "rule": { "interval": [{ "triggerAtHour": 23, "triggerAtMinute": 55 }]}}},
    { "name": "Delete a row", "type": "n8n-nodes-base.supabase", "parameters": { "operation": "delete", "tableId": "france_2025_influencers" }},
    { "name": "Schedule Trigger", "type": "n8n-nodes-base.scheduleTrigger", "parameters": { "rule": { "interval": [{ "triggerAtHour": 23, "triggerAtMinute": 58 }]}}},
    { "name": "Get row(s) in sheet", "type": "n8n-nodes-base.googleSheets", "parameters": { "sheetName": "France" }},
    { "name": "Transform Data", "type": "n8n-nodes-base.code", "parameters": { "jsCode": "/* ... JS transformation code ... */" }},
    { "name": "Supabase Insert", "type": "n8n-nodes-base.supabase", "parameters": { "tableId": "france_2025_influencers" }}
  ],
  "connections": { /* ... node connections ... */ }
}`}
        />
         <CodeBlock
          title="n8n Transformation Node (JS Code)"
          language="javascript"
          code={`// Clean and transform the data for Supabase
const items = $input.all();
const tableName = 'performance_data'; // Set your table name here

const transformedData = items.map((item, index) => {
  const cleanedItem = {};
  
  // Clean column names and handle data
  Object.keys(item.json).forEach(key => {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    let value = item.json[key];
    
    // Handle empty values
    if (value === '' || value === null || value === undefined) {
      value = null;
    }
    
    cleanedItem[cleanKey] = value;
  });
  
  // Add timestamps
  const now = new Date().toISOString();
  cleanedItem.created_at = now;
  cleanedItem.updated_at = now;
  
  // IMPORTANT: Add tableName for dynamic table reference
  cleanedItem.tableName = tableName;
  
  return { json: cleanedItem };
});

return transformedData;`}
        />
      </DocSection>

      <DocSection title="Stage 3: Supabase Database (Destination)" id="stage-3-supabase">
        <DocContent>
          The final destination for our data is a Supabase (PostgreSQL) database. A key architectural decision was made here for fault tolerance: all columns that are expected to be numerical (like views, clicks, conversions) are initially ingested as a `string` (text) data type.
          <br/><br/>
          This prevents the entire daily pipeline from failing if a user accidentally enters text into a numerical column in the source sheet. Once the data is safely ingested, a database trigger automatically runs. This trigger attempts to clean and convert the text in these columns into a proper numerical format, storing the clean result in a separate `_clean` column. This two-step process ensures both high availability of the data pipeline and data integrity for analysis.
        </DocContent>
      </DocSection>
    </DocLayout>
  );
}
