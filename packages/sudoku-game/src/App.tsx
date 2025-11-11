import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from '@ai-frontend/ui';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">数独游戏</h1>
        <p className="text-gray-600">挑战你的逻辑思维能力</p>
      </header>
      
      <main className="w-full max-w-4xl flex-grow">
        <Card className="w-full p-6 shadow-lg">
          <Outlet />
        </Card>
      </main>
      
      <footer className="w-full max-w-4xl mt-8 text-center text-gray-500 text-sm">
        <p>© 2024 数独游戏 | 使用 React + TypeScript + Tailwind CSS 构建</p>
      </footer>
    </div>
  );
};

export default App;