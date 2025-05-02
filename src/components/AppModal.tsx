
import { X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const AppModal = () => {
  const { isModalVisible, hideModal, modalContent } = useAppContext();

  if (!isModalVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={hideModal}
        aria-hidden="true"
      />
      <div className="z-50 bg-background rounded-lg shadow-lg border animate-fade-in">
        {modalContent}
      </div>
    </div>
  );
};

export default AppModal;
