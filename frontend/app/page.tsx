'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';
import RecommendationForm from '@/components/RecommendationForm';
import RecommendationDisplay from '@/components/RecommendationDisplay';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

interface Recommendation {
  recommended_policy: string;
  recommended_coverage: number;
  recommended_term: number | null;
  explanation: string;
}

export default function Home() {
  const { user, isInitialized, logout } = useAuth();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Initializing...</div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-gray-50 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Intelligent Insure
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            AI-driven life insurance recommendations in seconds.
          </p>
          {user && (
            <button 
              onClick={logout}
              className="absolute top-0 right-0 group flex items-center py-2 px-4 text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 border rounded-lg shadow-sm transition-colors"
            >
              Logout <LogOut className="ml-2 h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            </button>
          )}
        </motion.header>

        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={user ? (recommendation ? 'display' : 'form') : 'auth'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {user ? (
                recommendation ? (
                  <div>
                    <RecommendationDisplay recommendation={recommendation} />
                    <button
                      onClick={() => setRecommendation(null)}
                      className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Start New Recommendation
                    </button>
                  </div>
                ) : (
                  <RecommendationForm onRecommendation={setRecommendation} userEmail={user.email} />
                )
              ) : (
                <Auth />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; 2025 Intelligent Insure. A Portfolio Project.</p>
        </footer>
      </div>
    </main>
  );
}
