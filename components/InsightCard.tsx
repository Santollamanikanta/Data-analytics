
import React, { ReactNode } from 'react';
import Card from './ui/Card';
import { useTTS } from '../hooks/useTTS';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface InsightCardProps {
  title: string;
  icon: ReactNode;
  content: string | ReactNode;
  className?: string;
  showTTS?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, icon, content, className = '', showTTS = false }) => {
    const { play, isPlaying, isLoading: isTTSLoading } = useTTS();
    const textContent = typeof content === 'string' ? content : '';

    const handlePlayAudio = () => {
        if (textContent) {
            play(textContent);
        }
    }

  return (
    <Card className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
            <div className="text-primary">{icon}</div>
            <h3 className="font-semibold text-lg text-white">{title}</h3>
        </div>
        {showTTS && textContent && (
             <Button variant="ghost" size="sm" onClick={handlePlayAudio} disabled={isTTSLoading} className="!p-2 rounded-full">
                {isTTSLoading ? <Spinner className="w-4 h-4" /> : 
                 isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                 : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                }
             </Button>
        )}
      </div>
      {typeof content === 'string' ? (
        <p className="text-gray-300 text-sm leading-relaxed">{content}</p>
      ) : (
        <div className="text-gray-300 text-sm leading-relaxed">{content}</div>
      )}
    </Card>
  );
};

export default InsightCard;
