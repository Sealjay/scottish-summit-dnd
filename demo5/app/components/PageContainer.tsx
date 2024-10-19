import React from 'react';
import Header from './Header';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
      <div className="w-full max-w-4xl medieval-container shadow-2xl">
        <div className="relative z-10">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
