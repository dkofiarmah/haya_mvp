# Haya MVP

This repository contains the MVP (Minimum Viable Product) for Haya, a Next.js application.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up the environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

## Vercel Deployment

This project is configured for deployment on Vercel. We've made specific optimizations to ensure smooth deployment:

1. The project uses `next.config.mjs` (ES Modules format) for Next.js configuration
2. Custom build and install scripts are located in the `scripts/` directory
3. For detailed deployment information, see [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)

### Deployment Validation

Before deploying, run the validation script to ensure all configuration is correct:

```bash
./scripts/validate-vercel-config.sh
```

## Functionality

### AI Assistants

The application includes AI assistant functionality implemented in `lib/ai/ai-service.ts`. 
The assistants can:
- Generate responses based on conversation history
- Save messages to the database
- Retrieve conversation history

### Supabase Integration

Authentication and database operations are handled through Supabase:
- Client-side operations in `lib/supabase/browser.ts`
- Server-side operations in `lib/supabase/server.ts`

## Project Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: React components
- `lib/`: Utility functions and service integrations
- `scripts/`: Build and deployment scripts
- `public/`: Static assets
- `styles/`: CSS and styling files

## License

This project is proprietary and confidential.
