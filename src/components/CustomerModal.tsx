
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CustomerModal = ({ isOpen, onClose, children }: CustomerModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="z-50 p-4 max-w-lg w-full max-h-[95vh] overflow-auto bg-background rounded-lg shadow-lg border animate-fade-in">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default CustomerModal;
