import { Handler } from "@netlify/functions";

// Note: Netlify functions are stateless.
// For persistent storage, use a database like Supabase, PlanetScale, or MongoDB Atlas.

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Return empty array since we don't have persistent storage
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ designs: [] }),
  };
};
