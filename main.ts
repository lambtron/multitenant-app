import { Hono } from "hono";

const app = new Hono();

// Middleware to extract subdomain
app.use("*", async (c, next) => {
  const host = c.req.header("host") || "";

  // Extract subdomain (everything before the main domain)
  // e.g., andy.localhost -> andy
  // e.g., andy.roobarb.club -> andy
  // e.g., roobarb.club -> "" (no subdomain)
  let subdomain = "";

  // Define your base domain(s) - customize this for your setup
  const baseDomains = ["roobarb.club", "localhost"];

  // Remove port if present
  const hostWithoutPort = host.split(":")[0];

  // Check if this is the base domain (no subdomain)
  const isBaseDomain = baseDomains.some((base) => hostWithoutPort === base);

  if (!isBaseDomain) {
    // Check if it's a subdomain of one of the base domains
    const matchingBase = baseDomains.find((base) =>
      hostWithoutPort.endsWith("." + base)
    );

    if (matchingBase) {
      // Extract subdomain by removing the base domain part
      subdomain = hostWithoutPort.slice(0, -(matchingBase.length + 1));
    }
  }

  // Store subdomain in context
  c.set("subdomain", subdomain);
  await next();
});

// Main route
app.get("/", (c) => {
  const subdomain = c.get("subdomain") as string;

  // If no subdomain or it's just "localhost", show default page
  if (!subdomain || subdomain === "localhost" || subdomain === "example") {
    return c.html(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Multi-Tenant App</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 100px auto;
              padding: 20px;
              text-align: center;
            }
            h1 { color: #333; }
            code {
              background: #f4f4f4;
              padding: 2px 8px;
              border-radius: 4px;
            }
            .instructions {
              margin-top: 40px;
              text-align: left;
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <h1>🏢 Multi-Tenant App</h1>
          <p>Welcome! This is a wildcard subdomain demo.</p>

          <div class="instructions">
            <h3>Try it out:</h3>
            <p>Visit a subdomain:</p>
            <ul>
              <li><a href="https://moonbeam.roobarb.club">moonbeam.roobarb.club</a></li>
              <li><a href="https://velvet.roobarb.club">velvet.roobarb.club</a></li>
              <li><a href="https://cosmic.roobarb.club">cosmic.roobarb.club</a></li>
            </ul>
          </div>
        </body>
      </html>
    `);
  }

  // Tenant-specific page
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${subdomain}'s Page</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 600px;
            margin: 100px auto;
            padding: 20px;
            text-align: center;
          }
          h1 {
            font-size: 3rem;
            color: #0066cc;
          }
          .subdomain {
            color: #ff6b6b;
            font-weight: bold;
          }
          .card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          a {
            color: #fff;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>👋 hey <span class="subdomain">${subdomain}</span></h1>
          <p>This is your personal tenant page!</p>
          <p style="font-size: 0.9rem; margin-top: 30px;">
            <a href="https://roobarb.club">← Back to home</a>
          </p>
        </div>
      </body>
    </html>
  `);
});

// API endpoint example
app.get("/api/tenant", (c) => {
  const subdomain = c.get("subdomain") as string;
  return c.json({
    tenant: subdomain,
    message: `hey ${subdomain}`,
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/health", (c) => c.text("OK"));

const port = 8000;
console.log(`🚀 Server running at http://localhost:${port}`);
console.log(`📝 Add subdomains to /etc/hosts to test:`);
console.log(`   127.0.0.1 andy.localhost`);
console.log(`   127.0.0.1 sarah.localhost`);

Deno.serve({ port }, app.fetch);
