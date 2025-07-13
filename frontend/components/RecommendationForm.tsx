'use client';

import { useState } from 'react';
import api from '@/lib/api'; // Use our secure API service
import { motion } from 'framer-motion';
import { BarChart, DollarSign, Users, ShieldQuestion, ArrowRight } from 'lucide-react';

interface Recommendation {
  recommended_policy: string;
  recommended_coverage: number;
  recommended_term: number | null;
  explanation: string;
}

interface RecommendationFormProps {
  onRecommendation: (data: Recommendation) => void;
  userEmail: string | null;
}

export default function RecommendationForm({ onRecommendation, userEmail }: RecommendationFormProps) {
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [dependents, setDependents] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('Medium');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/recommendations/', {
        age: parseInt(age),
        income: parseInt(income),
        dependents: parseInt(dependents),
        risk_tolerance: riskTolerance,
      });
      onRecommendation(response.data);
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome, {userEmail}!</h2>
        <p className="text-gray-500 mt-2">Let's find the perfect plan for you. Please provide some basic information.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input fields with icons */}
          <div className="relative">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Your Age</label>
            <BarChart className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
            <input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required className="pl-10 pr-3 py-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div className="relative">
            <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
            <DollarSign className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
            <input id="income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} required className="pl-10 pr-3 py-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div className="relative">
            <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 mb-1">Dependents</label>
            <Users className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
            <input id="dependents" type="number" value={dependents} onChange={(e) => setDependents(e.target.value)} required className="pl-10 pr-3 py-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div className="relative">
            <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
            <ShieldQuestion className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
            <select id="riskTolerance" value={riskTolerance} onChange={(e) => setRiskTolerance(e.target.value)} required className="pl-10 pr-3 py-3 w-full bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </motion.div>
        )}

        <div>
          <button type="submit" disabled={isLoading} className="w-full group flex items-center justify-center py-4 px-4 border border-transparent rounded-lg shadow-lg text-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-300">
            {isLoading ? 'Analyzing Your Profile...' : 'Get My Recommendation'}
            {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
