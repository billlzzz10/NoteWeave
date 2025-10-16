'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Welcome to NoteWeave</h1>
        <p className="text-center text-gray-600">Sign in to continue</p>
        <div className="space-y-4">
          <button
            onClick={() => signIn('github', { callbackUrl: '/workspace' })}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
          >
            {/* SVG for GitHub icon can be added here */}
            Sign in with GitHub
          </button>
          <button
            onClick={() => signIn('google', { callbackUrl: '/workspace' })}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {/* SVG for Google icon can be added here */}
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}