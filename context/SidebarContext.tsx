'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,
  toggleLeftSidebar: () => {},
  toggleRightSidebar: () => {},
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(prev => !prev);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(prev => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        isLeftSidebarOpen,
        isRightSidebarOpen,
        toggleLeftSidebar,
        toggleRightSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
