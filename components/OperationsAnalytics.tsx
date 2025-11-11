import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import InsightCard from './InsightCard';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { getQuickSummary, getDeepAnalysis } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const inventoryData = [
  { name: 'Product A', stock: 400 }, { name: 'Product B', stock: 300 },
  { name: 'Product C', stock: 500 }, { name: 'Product D', stock: 250 },
  { name: 'Product E', stock: 600 }, { name: 'Product F', stock: 150 },
];

const efficiencyData = [
  { subject: 'Order Picking', A: 90, fullMark: 100 }, { subject: 'Packing', A: 98, fullMark: 100 },
  { subject: 'Shipping', A: 86, fullMark: 100 }, { subject: 'Delivery Time', A: 75, fullMark: 100 },
  { subject: 'Return Rate', A: 95, fullMark: 100 },
];

const OperationsAnalytics: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const axisColor = theme === 'dark' ? "#9ca3af" : "#6b7280";
  const gridColor = theme === 'dark' ? "#4b5563" : "#d1d5db";
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? "#374151" : "#e5e7eb"}`,
    borderRadius: '0.5rem',
  };
  const tooltipCursorStyle = { fill: theme === 'dark' ? '#374151' : '#f3f4f6' };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsSummaryLoading(true);
        const response = await getQuickSummary('Operations data indicates high packing efficiency but a bottleneck in the shipping department, causing delays.');
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
      const response = await getDeepAnalysis('Supply chain data, warehouse fulfillment times, and employee shift schedules for the last quarter.');
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
          title="AI Operations Brief"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>}
          content={isSummaryLoading ? <Spinner /> : summary}
          showTTS
        />
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Deep Operational Analysis</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Identify inefficiencies and get recommendations.</p>
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
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Inventory Levels</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} layout="vertical">
                <XAxis type="number" stroke={axisColor} fontSize={12} />
                <YAxis type="category" dataKey="name" stroke={axisColor} fontSize={12} width={80} />
                <Tooltip contentStyle={tooltipStyle} cursor={tooltipCursorStyle} />
                <Bar dataKey="stock" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Fulfillment Efficiency</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={efficiencyData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="subject" stroke={axisColor} fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={gridColor} />
                <Radar name="Efficiency" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OperationsAnalytics;
