# {{projectName}}

AI-powered Express API backend built with [@yourgpt/llm-sdk](https://docs.yourgpt.ai).

## Getting Started

1. Add your API key to `.env`:
   ```
   {{envKey}}=your_api_key_here
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Test the API:
   ```bash
   curl -X POST http://localhost:3001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"Hello!"}]}'
   ```

## API Endpoints

- `POST /api/chat` - Chat with the AI (streaming response)
- `GET /api/health` - Health check

## Building for Production

```bash
npm run build
npm start
```

## Learn More

- [LLM SDK Documentation](https://docs.yourgpt.ai/llm-sdk)
- [Express Documentation](https://expressjs.com/)
