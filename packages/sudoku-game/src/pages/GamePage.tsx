import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ai-frontend/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@ai-frontend/ui';

// 定义数独单元格类型
interface Cell {
  value: number | null;
  fixed: boolean;
}

// 生成空的数独板
const generateEmptyBoard = (): Cell[][] => {
  return Array.from({ length: 9 }, () => 
    Array.from({ length: 9 }, () => ({ value: null, fixed: false }))
  );
};

// 初始化示例数独数据（简单的数独布局）
const initializeSampleBoard = (): Cell[][] => {
  const board = generateEmptyBoard();
  // 设置一些固定数字作为示例
  const sampleData = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ];

  // 填充示例数据并标记固定单元格
  sampleData.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value !== null) {
        board[rowIndex][colIndex] = { value, fixed: true };
      }
    });
  });

  return board;
};

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Cell[][] | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [time, setTime] = useState(0);

  React.useEffect(() => {
    // 初始化数独板
    setBoard(initializeSampleBoard());
    
    // 启动计时器
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (board && !board[row][col].fixed) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num: number) => {
    if (!board || !selectedCell) return;
    
    const newBoard = [...board];
    newBoard[selectedCell.row][selectedCell.col] = {
      ...newBoard[selectedCell.row][selectedCell.col],
      value: num
    };
    setBoard(newBoard);
  };

  const handleClearCell = () => {
    if (!board || !selectedCell) return;
    
    const newBoard = [...board];
    newBoard[selectedCell.row][selectedCell.col] = {
      ...newBoard[selectedCell.row][selectedCell.col],
      value: null
    };
    setBoard(newBoard);
  };

  const handleRestart = () => {
    setBoard(initializeSampleBoard());
    setSelectedCell(null);
    setTime(0);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!board) {
    return <div className="text-center">加载中...</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex justify-between w-full max-w-xl items-center">
        <Button onClick={handleBackHome}>返回主页</Button>
        <div className="text-xl font-mono bg-gray-100 px-4 py-2 rounded">
          时间: {formatTime(time)}
        </div>
        <Button onClick={handleRestart}>重新开始</Button>
      </div>

      <div className="border-2 border-gray-300 p-2 bg-white rounded-lg shadow-lg">
        <table className="border-collapse">
          <tbody>
            {board.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={[
                      'w-12 h-12 border border-gray-200 text-center text-xl font-medium cursor-pointer',
                      cell.fixed && 'bg-gray-100 text-gray-800',
                      !cell.fixed && 'hover:bg-gray-50',
                      selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex && 'bg-blue-100',
                      // 为3x3的分隔添加更粗的边框
                      rowIndex % 3 === 0 && 'border-t-2',
                      colIndex % 3 === 0 && 'border-l-2',
                      rowIndex === 8 && 'border-b-2',
                      colIndex === 8 && 'border-r-2',
                    ].filter(Boolean).join(' ')}
                  >
                    {cell.value || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-10 gap-2 w-full max-w-md">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            className="h-12 text-lg"
            onClick={() => handleNumberInput(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="destructive"
          className="h-12 text-lg"
          onClick={handleClearCell}
        >
          清除
        </Button>
      </div>

      <Card className="w-full max-w-md mt-4">
        <CardContent className="text-center text-sm text-gray-500">
          <p>点击格子后，使用数字按钮填写或清除数值</p>
          <p>预设的数字无法修改，确保每行、每列和每个3x3宫格内不重复</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamePage;