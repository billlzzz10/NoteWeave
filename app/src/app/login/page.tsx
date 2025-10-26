"use client";

import AuthForm from '@/components/AuthForm';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-sm text-gray-600">to continue to NoteWeave</p>
        </div>

        <AuthForm authType="login" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { void signIn('github', { callbackUrl: '/workspace' }); }}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            GitHub
          </button>
          <button
            onClick={() => { void signIn('google', { callbackUrl: '/workspace' }); }}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Google
          </button>
        </div>

        <div className="text-sm text-center">
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Don&apos;t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}