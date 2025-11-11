import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import InsightCard from './InsightCard';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { getQuickSummary, getDeepAnalysis } from '../services/geminiService';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const satisfactionData = [
  { name: '5 Stars', uv: 31.47, pv: 2400, fill: '#10b981' },
  { name: '4 Stars', uv: 26.69, pv: 4567, fill: '#34d399' },
  { name: '3 Stars', uv: 15.69, pv: 1398, fill: '#6ee7b7' },
  { name: '2 Stars', uv: 8.22, pv: 9800, fill: '#f59e0b' },
  { name: '1 Star', uv: 4.63, pv: 3908, fill: '#ef4444' },
];

const ltvData = [
    {name: 'Jan', ltv: 220}, {name: 'Feb', ltv: 250}, {name: 'Mar', ltv: 280},
    {name: 'Apr', ltv: 310}, {name: 'May', ltv: 300}, {name: 'Jun', ltv: 340},
];

const CustomerAnalytics: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const axisColor = theme === 'dark' ? "#9ca3af" : "#6b7280";
  const gridColor = theme === 'dark' ? "#374151" : "#e5e7eb";
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    border: `1px solid ${gridColor}`,
    borderRadius: '0.5rem',
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsSummaryLoading(true);
        const response = await getQuickSummary('Customer feedback shows high satisfaction with product quality, but complaints about slow shipping times.');
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
      const response = await getDeepAnalysis('Customer support tickets, NPS scores, and repeat purchase data for the last 6 months.');
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
          title="AI Customer Snapshot"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          content={isSummaryLoading ? <Spinner /> : summary}
          showTTS
        />
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Deep Customer Analysis</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyze customer behavior and churn.</p>
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
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Customer Satisfaction (CSAT)</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" barSize={15} data={satisfactionData}>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="uv"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip contentStyle={tooltipStyle} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Customer Lifetime Value (LTV)</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ltvData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
                    <YAxis stroke={axisColor} fontSize={12} tickFormatter={(v) => `$${v}`} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="ltv" stroke="#10b981" strokeWidth={2} name="LTV" />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
