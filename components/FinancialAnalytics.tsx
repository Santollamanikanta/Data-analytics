import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import InsightCard from './InsightCard';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { getQuickSummary, getDeepAnalysis } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const cashflowData = [
  { name: 'Jan', income: 4000, outcome: 2400 }, { name: 'Feb', income: 3000, outcome: 1398 },
  { name: 'Mar', income: 2000, outcome: 4800 }, { name: 'Apr', income: 2780, outcome: 3908 },
  { name: 'May', income: 1890, outcome: 4800 }, { name: 'Jun', income: 2390, outcome: 3800 },
];
const expenseData = [
    { name: 'Marketing', value: 400 }, { name: 'Salaries', value: 1200 },
    { name: 'Software', value: 300 }, { name: 'Utilities', value: 250 },
];
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const FinancialAnalytics: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const axisColor = theme === 'dark' ? "#9ca3af" : "#6b7280";
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? "#374151" : "#e5e7eb"}`,
    borderRadius: '0.5rem',
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsSummaryLoading(true);
        const response = await getQuickSummary('Financial data shows healthy cash flow but a 15% increase in marketing spend this quarter.');
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
      const response = await getDeepAnalysis('Profit & loss statements, balance sheets, and cash flow reports for the last fiscal year.');
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
          title="AI Financial Health Check"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>}
          content={isSummaryLoading ? <Spinner /> : summary}
          showTTS
        />
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Deep Financial Analysis</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate a report on profitability and spending.</p>
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
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Cash Flow</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData}>
                <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" />
                <Area type="monotone" dataKey="outcome" stackId="1" stroke="#ef4444" fill="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
