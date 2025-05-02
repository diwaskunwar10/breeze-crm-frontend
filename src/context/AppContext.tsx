
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextProps {
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
  modalContent: React.ReactNode | null;
  isModalVisible: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isGlobalLoading, setGlobalLoading] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    // Clear content after animation finishes
    setTimeout(() => {
      setModalContent(null);
    }, 300);
  };

  return (
    <AppContext.Provider
      value={{
        isGlobalLoading,
        setGlobalLoading,
        showModal,
        hideModal,
        modalContent,
        isModalVisible,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
