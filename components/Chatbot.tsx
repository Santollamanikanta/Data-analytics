import React, { useState, useRef, useEffect } from 'react';
import { Sender, ChatMessage } from '../types';
import { getChatbotResponseStream } from '../services/geminiService';
import Button from './ui/Button';

// FIX: Moved BotMessage and UserMessage outside the Chatbot component.
// This is a React best practice to prevent re-creation on every render
// and resolves TypeScript errors related to the 'key' prop.
// FIX: Explicitly type components as React.FC to resolve errors with the 'key' prop.
interface MessageProps {
    text: string;
}

const BotMessage: React.FC<MessageProps> = ({text}) => (
    <div className="flex items-end gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z"/></svg>
        </div>
        <div className="bg-gray-200 dark:bg-dark-700 p-3 rounded-lg rounded-bl-none max-w-xs md:max-w-sm">
            <p className="text-sm text-gray-800 dark:text-gray-200">{text}</p>
        </div>
    </div>
);

const UserMessage: React.FC<MessageProps> = ({text}) => (
    <div className="flex items-end justify-end gap-2">
        <div className="bg-primary p-3 rounded-lg rounded-br-none max-w-xs md:max-w-sm">
            <p className="text-sm text-white">{text}</p>
        </div>
    </div>
);

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
      if (!isOpen) return;
      setMessages([
          {
              id: 'initial',
              text: 'Hello! I am your AI Business Analyst. How can I help you today?',
              sender: Sender.Bot
          }
      ]);
  }, [isOpen]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: Sender.User,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: botMessageId, text: '', sender: Sender.Bot }]);

    try {
        const stream = getChatbotResponseStream(input);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk.text;
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
                )
            );
        }
    } catch (error) {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === botMessageId ? { ...msg, text: 'Sorry, I encountered an error.' } : msg
            )
        );
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-full scale-0' : 'translate-x-0 scale-100'}`}>
        <Button onClick={() => setIsOpen(true)} className="rounded-full !p-4 shadow-lg">
           <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z"/></svg>
        </Button>
      </div>

      <div className={`fixed bottom-0 right-0 z-50 h-full w-full md:h-[85vh] md:w-[400px] md:bottom-6 md:right-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 shadow-2xl rounded-lg flex flex-col transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-t-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="!p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </Button>
        </header>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
             msg.sender === Sender.Bot 
             ? <BotMessage key={msg.id} text={msg.text + (isLoading && msg.id === messages[messages.length-1].id ? '...' : '')} /> 
             : <UserMessage key={msg.id} text={msg.text} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
