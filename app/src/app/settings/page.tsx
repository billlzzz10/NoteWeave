'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');

  function handleProviderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setProvider(e.target.value);
    // In a real app, you would fetch models for the selected provider
    setModel('');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save settings will be implemented later
    console.log({ provider, apiKey, model });
    alert('Settings saved! (Not really, this is just a demo)');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Provider Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
              AI Provider
            </label>
            <select
              id="provider"
              value={provider}
              onChange={handleProviderChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="openai">OpenAI</option>
              <option value="openrouter">OpenRouter</option>
              <option value="vercel_ai">Vercel AI Gateway</option>
            </select>
          </div>

          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <input
              type="password"
              id="api-key"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your API key"
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!provider} // Example: disable if no provider is selected
            >
              {/* Models would be populated dynamically based on the provider */}
              <option value="">Select a model</option>
              {provider === 'openai' && (
                <>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </>
              )}
              {provider === 'openrouter' && (
                <>
                  <option value="openrouter/auto">Auto (recommended)</option>
                  <option value="mistralai/mistral-7b-instruct">Mistral 7B</option>
                </>
              )}
               {provider === 'vercel_ai' && (
                <>
                  <option value="claude-2">Claude 2</option>
                  <option value="llama-2-70b-chat">Llama 2 70b</option>
                </>
              )}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}