// netlify/functions/proxy.js
export async function handler(event) {
  // handle preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://your-github-pages-domain",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: ""
    };
  }

  // parse incoming body (from your frontend)
  const payload = event.body ? JSON.parse(event.body) : {};

  // forward to n8n webhook (stored in env var)
  const res = await fetch(process.env.N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.text(); // keep as text then return

  return {
    statusCode: res.ok ? 200 : res.status,
    headers: {
      "Content-Type": "application/json",
      // allow your GitHub Pages origin (or use "*" for quick test)
      "Access-Control-Allow-Origin": "https://your-github-pages-domain",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: data
  };
}
