## NoteWeave Engine Testing

This notebook demonstrates how to use NoteWeave Engine for RAG (Retrieval-Augmented Generation) and semantic search.

### Setup
First, let's make sure we have the required dependencies:
```
npm install
```

Create a `.env` file based on `.env.example`:
```
cp .env.example .env
```

Edit the `.env` file to add your API keys if needed. If you're only using Ollama, no API keys are required.

### Testing the Engine

Let's create a simple test script:

```typescript
// test.ts
import { 
  addMarkdownDocument, 
  askQuestion, 
  semanticSearch,
  getAvailableProviders
} from './src/api';

async function main() {
  // Add some test documents
  await addMarkdownDocument(
    '# TypeScript\nTypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    'TypeScript Docs'
  );
  
  await addMarkdownDocument(
    '# JavaScript\nJavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.',
    'JavaScript Docs'
  );
  
  await addMarkdownDocument(
    '# Python\nPython is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation.',
    'Python Docs'
  );
  
  // List available providers
  console.log('Available AI Providers:');
  const providers = getAvailableProviders();
  providers.forEach(provider => {
    console.log(`- ${provider.name} (${provider.id}): ${provider.description}`);
  });
  
  // Perform semantic search
  console.log('\n--- Semantic Search Results ---');
  const searchResults = await semanticSearch('What is TypeScript?', 3, true);
  
  searchResults.forEach((result, index) => {
    console.log(`\nResult ${index + 1} [${result.relevancePercentage}% confidence]:`);
    console.log(`Source: ${result.document.metadata.source}`);
    console.log(`Content: ${result.contentPreview || result.document.content}`);
    if (result.keywordMatches) {
      console.log(`Keywords: ${result.keywordMatches.map(k => `${k.term} (${k.count})`).join(', ')}`);
    }
  });
  
  // Ask a question using RAG
  console.log('\n--- RAG Answer ---');
  const answer = await askQuestion('Compare TypeScript and JavaScript', { 
    provider: 'ollama',
    enhanceWithSummary: true,
    highlightKeywords: true,
    includeConfidenceScores: true
  });
  
  console.log(`Question: ${answer.question}`);
  console.log(`Answer: ${answer.answer}`);
  console.log('Sources:');
  answer.sources.forEach((source, index) => {
    console.log(`- ${source.source} (${source.confidenceScore}% confidence)`);
  });
}

main().catch(console.error);
```

Compile and run:
```
npx tsc
node dist/test.js
```

### Expected Output

The output should show:
1. Available AI providers
2. Semantic search results for "What is TypeScript?"
3. RAG answer for "Compare TypeScript and JavaScript"

### Troubleshooting

- If you get errors about missing modules, make sure you've installed all dependencies with `npm install`
- For Ollama issues, ensure the Ollama service is running locally at http://localhost:11434
- For API key issues, check your `.env` file for correct API keys
- If you get embedding errors, ensure the embedding model is available in Ollama
