//src/app/studio/mint/components/TransactionModal.tsx

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const TransactionModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timeoutId = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  return ReactDOM.createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'pointer-events-none'}`}>
      <div 
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      <div 
        className={`bg-white rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 max-w-lg w-full p-6 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {children}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default TransactionModal;
