import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3000); // Start fade-out after 3 seconds

    const closeTimer = setTimeout(() => {
        onClose();
    }, 3500); // Fully close after fade-out animation

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div 
        className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg bg-green-500 text-white animate-slide-in ${isFadingOut ? 'animate-fade-out' : ''}`}
        role="alert"
    >
        <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{message}</span>
        </div>
    </div>
  );
};

export default Toast;
