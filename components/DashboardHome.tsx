import React from 'react';
import Card from './ui/Card';
import InsightCard from './InsightCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const salesData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
];

const customerData = [
  { name: 'Week 1', new: 20, returning: 35 }, { name: 'Week 2', new: 25, returning: 40 },
  { name: 'Week 3', new: 30, returning: 42 }, { name: 'Week 4', new: 28, returning: 48 },
];

const KPI_CARDS = [
    { title: 'Total Revenue', value: '$432,190', change: '+12.5%', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { title: 'New Customers', value: '1,204', change: '+8.2%', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg> },
    { title: 'Avg. Order Value', value: '$89.50', change: '-1.8%', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { title: 'Conversion Rate', value: '3.45%', change: '+0.5%', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M1 20v-6a8 8 0 0 1 8-8h11"/></svg> },
]

const DashboardHome: React.FC = () => {
    const { theme } = useTheme();

    const axisColor = theme === 'dark' ? "#9ca3af" : "#6b7280";
    const gridColor = theme === 'dark' ? "#374151" : "#e5e7eb";
    const tooltipStyle = {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        border: `1px solid ${gridColor}`,
        borderRadius: '0.5rem',
    };
    const tooltipCursorStyle = { fill: theme === 'dark' ? '#374151' : '#f3f4f6' };
    
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_CARDS.map(kpi => (
            <Card key={kpi.title}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg text-primary">{kpi.icon}</div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                        <p className={`text-sm font-semibold ${kpi.change.startsWith('+') ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{kpi.change}</p>
                    </div>
                </div>
            </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <InsightCard 
            title="AI Weekly Summary"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
            content="This week shows a strong 8% increase in user engagement, primarily driven by the new feature launch. However, a slight dip in mobile app sessions suggests a potential performance issue that should be investigated."
            showTTS
         />
         <InsightCard 
            title="Actionable Recommendation"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2.5a2.5 2.5 0 0 1 3 3L6 21l-4 1 1-4Z"/><path d="m14 6 3 3"/></svg>}
            content="Customer cohort analysis reveals that users acquired via the 'Summer Sale' campaign have a 25% higher lifetime value. Consider reallocating marketing budget to a similar campaign for the upcoming holiday season."
            showTTS
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Revenue Overview (6 Months)</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                        <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={tooltipCursorStyle}/>
                        <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
             <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Customer Trends (Monthly)</h3>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customerData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line type="monotone" dataKey="new" stroke="#4f46e5" strokeWidth={2} name="New" />
                        <Line type="monotone" dataKey="returning" stroke="#10b981" strokeWidth={2} name="Returning" />
                    </LineChart>
                </ResponsiveContainer>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
