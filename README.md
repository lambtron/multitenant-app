# Multi-Tenant Subdomain App

A wildcard subdomain multi-tenant website built with Deno, Hono, and JSR.

## Features

- 🎯 Wildcard subdomain routing
- 🚀 Built with Hono (from JSR)
- ⚡ Powered by Deno
- 🎨 Beautiful tenant-specific pages
- 📡 API endpoint for tenant info

## Quick Start

### 1. Install Deno

```bash
curl -fsSL https://deno.land/install.sh | sh
```

### 2. Run the app

```bash
deno task dev
```

Or directly:

```bash
deno run --allow-net --allow-env main.ts
```

### 3. Test it out

Visit in your browser:
- https://roobarb.club - Default homepage
- https://moonbeam.roobarb.club - Moonbeam's page (shows "hey moonbeam")
- https://velvet.roobarb.club - Velvet's page (shows "hey velvet")
- https://cosmic.roobarb.club/api/tenant - API endpoint

## How It Works

1. **Subdomain extraction**: Middleware parses the `Host` header to extract subdomain
2. **Context storage**: Subdomain is stored in Hono context using `c.set()`
3. **Dynamic routing**: Routes use the subdomain to personalize content
4. **Fallback**: No subdomain or base domain shows default page

## API Endpoints

### `GET /`
Returns HTML page with personalized greeting based on subdomain.

### `GET /api/tenant`
Returns JSON with tenant information:
```json
{
  "tenant": "andy",
  "message": "hey andy",
  "timestamp": "2025-12-08T..."
}
```

### `GET /health`
Health check endpoint.

## Production Deployment

For production use:

1. **DNS Setup**: Add wildcard A record `*.yourdomain.com` pointing to your server
2. **Reverse Proxy**: Use Nginx or Caddy for SSL/TLS:

```nginx
server {
    server_name *.yourdomain.com;
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }
}
```

3. **Deploy**: Use Deno Deploy, Docker, or any VPS

## Tech Stack

- [Deno](https://deno.com) - Modern JavaScript runtime
- [Hono](https://hono.dev) - Ultrafast web framework (via JSR)
- [JSR](https://jsr.io) - JavaScript registry

## License

MIT
