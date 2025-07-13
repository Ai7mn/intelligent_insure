'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Target, Calendar, BarChartBig, Info } from 'lucide-react';

interface Recommendation {
  recommended_policy: string;
  recommended_coverage: number;
  recommended_term: number | null;
  explanation: string;
}

interface RecommendationDisplayProps {
  recommendation: Recommendation;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const StatCard = ({ icon, label, value, isPrimary = false }: { icon: React.ReactNode, label: string, value: string, isPrimary?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className={`p-6 rounded-xl shadow-md ${isPrimary ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
  >
    <div className="flex items-center">
      <div className={`mr-4 p-2 rounded-full ${isPrimary ? 'bg-white/20' : 'bg-indigo-100'}`}>
        {icon}
      </div>
      <h4 className={`text-sm font-semibold uppercase tracking-wider ${isPrimary ? 'text-indigo-200' : 'text-gray-500'}`}>{label}</h4>
    </div>
    <p className="text-4xl font-bold mt-3">{value}</p>
  </motion.div>
);

export default function RecommendationDisplay({ recommendation }: RecommendationDisplayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="text-3xl font-bold text-gray-900 mt-4">
          Your Personalized Plan is Ready
        </h2>
        <p className="text-gray-500 mt-2">Based on our analysis, here is the optimal strategy for your needs.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<BarChartBig className="text-indigo-600"/>} label="Policy Type" value={recommendation.recommended_policy} isPrimary={true} />
        <StatCard icon={<Target className="text-indigo-600"/>} label="Coverage Amount" value={formatCurrency(recommendation.recommended_coverage)} />
        <StatCard icon={<Calendar className="text-indigo-600"/>} label="Policy Term" value={recommendation.recommended_term ? `${recommendation.recommended_term} Years` : 'Permanent'} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-indigo-50 p-6 rounded-xl border border-indigo-200"
      >
        <div className="flex">
          <Info className="h-5 w-5 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Our Recommendation Rationale</h4>
            <p className="mt-2 text-gray-700 leading-relaxed">
              {recommendation.explanation}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
