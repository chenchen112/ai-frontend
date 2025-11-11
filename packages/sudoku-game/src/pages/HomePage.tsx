import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ai-frontend/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@ai-frontend/ui';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">欢迎来到数独游戏</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-gray-600">选择难度开始游戏：</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" onClick={handleStartGame}>简单</Button>
              <Button variant="secondary" onClick={handleStartGame}>中等</Button>
              <Button variant="secondary" onClick={handleStartGame}>困难</Button>
            </div>
          </div>
          
          <Button 
            className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
            onClick={handleStartGame}
          >
            开始游戏
          </Button>
        </CardContent>
      </Card>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">游戏规则</h3>
        <p className="text-gray-600 max-w-md">
          在9x9的网格中填入数字1-9，使得每一行、每一列和每一个3x3的小九宫格内的数字不重复。
          部分格子已经预先填入数字，你需要完成剩余格子的填写。
        </p>
      </div>
    </div>
  );
};

export default HomePage;