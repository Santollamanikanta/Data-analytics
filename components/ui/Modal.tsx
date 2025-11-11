import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-dark-800 rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 focus:outline-none"
            aria-label="Close modal"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
