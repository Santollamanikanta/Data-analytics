import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import InsightCard from './InsightCard';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { getQuickSummary, getDeepAnalysis } from '../services/geminiService';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const funnelData = [
  { value: 100, name: 'Visitors', fill: '#4f46e5' },
  { value: 80, name: 'Product Views', fill: '#6366f1' },
  { value: 50, name: 'Add to Cart', fill: '#818cf8' },
  { value: 30, name: 'Checkout', fill: '#a5b4fc' },
  { value: 25, name: 'Purchase', fill: '#c7d2fe' },
];

const channelData = [
  { name: 'Direct', value: 400 },
  { name: 'Organic Search', value: 300 },
  { name: 'Social Media', value: 200 },
  { name: 'Referral', value: 100 },
];
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const SalesAnalytics: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? "#374151" : "#e5e7eb"}`,
    borderRadius: '0.5rem',
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsSummaryLoading(true);
        const response = await getQuickSummary('Q3 sales data showing strong growth in electronics but a dip in apparel.');
        setSummary(response.text);
      } catch (e) {
        setError('Failed to fetch summary.');
      } finally {
        setIsSummaryLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleDeepAnalysis = async () => {
    try {
      setIsAnalysisLoading(true);
      setAnalysis('');
      const response = await getDeepAnalysis('Detailed sales logs, customer demographics, and marketing spend for Q3.');
      setAnalysis(response.text);
    } catch (e) {
      setError('Failed to fetch deep analysis.');
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightCard
          title="AI Quick Readout"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>}
          content={isSummaryLoading ? <Spinner /> : summary}
          showTTS
        />
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Comprehensive Analysis</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get a detailed report on sales performance.</p>
                </div>
                <Button onClick={handleDeepAnalysis} disabled={isAnalysisLoading}>
                    {isAnalysisLoading ? <Spinner /> : 'Generate'}
                </Button>
            </div>
            {analysis && (
                 <div className="mt-4 prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
            )}
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Sales Funnel</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Funnel dataKey="value" data={funnelData} isAnimationActive />
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Revenue by Channel</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={{ fill: theme === 'dark' ? '#fff' : '#000' }}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SalesAnalytics;
