import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { getMarketInsights } from '../services/geminiService';
import { GroundingChunk } from '../types';

const MarketAnalytics: React.FC = () => {
  const [query, setQuery] = useState('What are the latest e-commerce trends for small businesses in 2024?');
  const [result, setResult] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResult('');
    setSources([]);

    try {
      const response = await getMarketInsights(query);
      setResult(response.text);
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        setSources(groundingChunks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Live Market Insights with Google Search Grounding</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Ask a question about market trends, competitor analysis, or industry news to get up-to-date, AI-powered answers grounded in real-time web search results.</p>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Top marketing strategies for DTC brands"
            className="flex-1 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !query.trim()}>
            {isLoading ? <Spinner /> : 'Get Insights'}
          </Button>
        </form>
      </Card>
      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
      {result && (
        <Card>
            <div className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />
            {sources.length > 0 && (
                <div className="mt-6 border-t border-gray-200 dark:border-dark-700 pt-4">
                    <h4 className="font-semibold text-base text-gray-900 dark:text-white mb-2">Sources:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {sources.map((chunk, index) => (
                           chunk.web && <li key={index}>
                                <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    {chunk.web.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
      )}
    </div>
  );
};

export default MarketAnalytics;
