# Smart Translator Backend Setup Guide

## Overview
The Smart Translator uses Google's Gemini AI API to provide intelligent crypto/DeFi term translations. It automatically falls back to a comprehensive dictionary if the API is unavailable.

## Features
- **AI-Powered Analysis**: Uses Gemini 1.5 Flash (free tier) for dynamic translations
- **Intelligent Context**: Understands complex DeFi concepts and provides BSC-specific examples
- **Risk Assessment**: Categorizes terms by risk level and category
- **Fallback System**: Works even without API key using built-in dictionary
- **BNB Chain Focus**: Specialized for BNB Smart Chain ecosystem

## Setup Instructions

### 1. Get Gemini API Key (Free)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key

### 2. Environment Configuration
1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies
```bash
npm install @google/generative-ai
```

### 4. Test the API
The translator endpoint is available at: `/api/translator/analyze`

Example request:
```javascript
const response = await fetch('/api/translator/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "I want to provide liquidity to earn yield but I'm worried about impermanent loss",
    mode: "text" // or "term" for single term lookup
  })
});

const data = await response.json();
console.log(data.translations);
```

## API Endpoints

### POST `/api/translator/analyze`

**Request Body:**
```json
{
  "text": "string", // Text to analyze or term to look up
  "mode": "text" | "term" // Analysis mode
}
```

**Response:**
```json
{
  "translations": [
    {
      "term": "Impermanent Loss",
      "simpleDef": "Easy explanation...",
      "technicalDef": "Technical definition...",
      "example": "Real BSC example...",
      "category": "DeFi",
      "riskLevel": "Medium",
      "relatedTerms": ["yield farming", "liquidity provider"]
    }
  ],
  "source": "AI-powered" // or "dictionary-based"
}
```

## Modes

### Text Analysis Mode (`mode: "text"`)
- Analyzes full sentences/paragraphs
- Identifies multiple crypto terms
- Provides context-aware explanations
- Best for complex DeFi content

### Term Lookup Mode (`mode: "term"`)
- Single term definitions
- Detailed explanations
- Related term suggestions
- Best for learning specific concepts

## Categories
- **DeFi**: Protocols, yield farming, liquidity
- **Trading**: Market concepts, strategies
- **Security**: Risks, scams, best practices
- **Technical**: Blockchain mechanics, smart contracts
- **Governance**: DAOs, voting, tokenomics
- **Gaming**: GameFi, NFTs, play-to-earn

## Risk Levels
- **Low**: Basic concepts, established protocols
- **Medium**: DeFi protocols, moderate complexity
- **High**: Advanced strategies, experimental protocols

## Error Handling
The API includes comprehensive error handling:
- Falls back to dictionary if Gemini API fails
- Validates all responses
- Provides meaningful error messages
- Logs issues for debugging

## Rate Limits
Gemini's free tier includes:
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per minute

The fallback dictionary has no limits.

## Customization

### Adding New Terms
Edit `src/app/api/translator/analyze/route.ts` and add to `cryptoDictionary`:

```typescript
'new-term': {
  term: 'New Term',
  simpleDef: 'Simple explanation...',
  technicalDef: 'Technical definition...',
  example: 'BSC example...',
  category: 'DeFi',
  riskLevel: 'Medium',
  relatedTerms: ['related1', 'related2']
}
```

### Modifying AI Prompts
Edit prompts in `src/lib/gemini.ts` to customize AI behavior.

## Monitoring & Analytics
- Response source tracking (AI vs dictionary)
- Error logging for debugging
- Performance metrics available in logs
- Usage patterns for optimization

## Production Considerations
- Set up proper error monitoring
- Implement caching for common terms
- Consider rate limiting for public APIs
- Monitor Gemini API usage and costs
- Have backup strategies for API outages

## Security
- API key stored in environment variables
- No sensitive data logged
- Input validation and sanitization
- Rate limiting recommended for production
