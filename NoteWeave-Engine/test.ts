import { 
  addMarkdownDocument, 
  askQuestion, 
  semanticSearch,
  getAvailableProviders,
  getKnowledgeBaseStats
} from './src/api';

async function main() {
  console.log('NoteWeave Engine Test');
  console.log('--------------------\n');
  
  // Show initial stats
  console.log('Initial knowledge base stats:');
  const initialStats = getKnowledgeBaseStats();
  console.log(initialStats);
  console.log();
  
  // Add some test documents
  console.log('Adding test documents...');
  
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
  
  // Add a more complex document
  await addMarkdownDocument(
    `# React
React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.

## Core Features
- **Component-Based**: Build encapsulated components that manage their own state, then compose them to make complex UIs.
- **Declarative**: React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.
- **Learn Once, Write Anywhere**: You can develop new features in React without rewriting existing code. React can also render on the server using Node and power mobile apps using React Native.

## Example Code
\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
\`\`\``,
    'React Docs'
  );
  
  // Show updated stats
  console.log('Updated knowledge base stats:');
  const updatedStats = getKnowledgeBaseStats();
  console.log(updatedStats);
  console.log();
  
  // List available providers
  console.log('Available AI Providers:');
  const providers = getAvailableProviders();
  providers.forEach(provider => {
    console.log(`- ${provider.name} (${provider.id}): ${provider.description}`);
  });
  console.log();
  
  // Perform semantic search
  console.log('--- Semantic Search Results ---');
  const searchResults = await semanticSearch('What is TypeScript?', 3, true);
  
  searchResults.forEach((result, index) => {
    console.log(`\nResult ${index + 1} [${result.relevancePercentage || Math.round(result.score * 100)}% relevance]:`);
    console.log(`Source: ${result.document.metadata.source}`);
    console.log(`Content: ${result.document.content}`);
    
    if (result.highlightedText) {
      console.log(`Highlight: ${result.highlightedText}`);
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
  
  console.log(`Question: Compare TypeScript and JavaScript`);
  console.log(`Answer: ${answer.answer}`);
  
  if (answer.insightSummary) {
    console.log(`\nInsight Summary: ${answer.insightSummary}`);
  }
  
  console.log('\nSources:');
  answer.sources.forEach((source, index) => {
    console.log(`- ${source.metadata.source} (${source.relevancePercentage || Math.round(source.score * 100)}% relevance)`);
  });
  
  // Test another search
  console.log('\n--- Another Search ---');
  const reactResults = await semanticSearch('React components and features', 2, true);
  
  reactResults.forEach((result, index) => {
    console.log(`\nResult ${index + 1} [${result.relevancePercentage || Math.round(result.score * 100)}% relevance]:`);
    console.log(`Source: ${result.document.metadata.source}`);
    console.log(`Content: ${result.document.content.substring(0, 200)}...`);
  });
}

main().catch(console.error);
