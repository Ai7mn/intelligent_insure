'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api'; // Use our secure API service
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLogin ? '/api/auth/token/' : '/api/auth/register/';
    
    try {
      const response = await api.post(endpoint, { email, password });
      if (isLogin) {
        login(response.data.access, response.data.refresh);
      } else {
        // Automatically log in the user after successful registration
        const loginResponse = await api.post('/api/auth/token/', { email, password });
        login(loginResponse.data.access, loginResponse.data.refresh);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 
                       (err.response?.data && typeof err.response.data === 'object' 
                         ? Object.values(err.response.data).flat().join(' ') 
                         : 'An unknown error occurred.');
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Secure Login' : 'Create Account'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Welcome back to Intelligent Insure.' : 'Get started with your personalized plan.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields... */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"/>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </motion.div>
          )}

          <div>
            <button type="submit" disabled={isLoading} className="w-full group flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-300">
              {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-medium text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
            {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Log In'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
