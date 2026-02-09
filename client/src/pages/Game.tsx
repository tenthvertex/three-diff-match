import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GameState, initializeGame, selectTile, resetGame, checkGameOver, TileType } from '@/lib/gameLogic';
import { Heart, Star, Circle, Square, Triangle, Zap, Flower, Moon } from 'lucide-react';

const TILE_ICONS: Record<TileType, React.ReactNode> = {
  star: <Star className="w-8 h-8" />,
  circle: <Circle className="w-8 h-8" />,
  square: <Square className="w-8 h-8" />,
  triangle: <Triangle className="w-8 h-8" />,
  diamond: <Zap className="w-8 h-8" />,
  heart: <Heart className="w-8 h-8" />,
  flower: <Flower className="w-8 h-8" />,
  moon: <Moon className="w-8 h-8" />,
};

const TILE_COLORS: Record<TileType, string> = {
  star: 'bg-yellow-400',
  circle: 'bg-blue-400',
  square: 'bg-red-400',
  triangle: 'bg-green-400',
  diamond: 'bg-purple-400',
  heart: 'bg-pink-400',
  flower: 'bg-orange-400',
  moon: 'bg-indigo-400',
};

/**
 * 游戏主页面
 * 设计理念：现代游戏风格，清晰的视觉反馈，流畅的交互
 */
export default function Game() {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame(6, 6));
  const [isAnimating, setIsAnimating] = useState(false);

  // 处理方块点击
  const handleTileClick = (tileId: string) => {
    if (isAnimating || gameState.gameOver) return;
    
    const newState = selectTile(gameState, tileId);
    setGameState(newState);

    // 检查游戏是否结束
    if (checkGameOver(newState)) {
      newState.gameOver = true;
      setGameState(newState);
    }
  };

  // 处理重新开始
  const handleReset = () => {
    setGameState(resetGame());
  };

  // 获取活跃的方块
  const activeTiles = gameState.tiles.filter(t => !t.isRemoved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* 游戏容器 */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">三异连连看</h1>
          <p className="text-gray-600">选择三个不同图案的方块来消除它们</p>
        </div>

        {/* 游戏信息栏 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">分数</p>
            <p className="text-3xl font-bold text-blue-600">{gameState.score}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">步数</p>
            <p className="text-3xl font-bold text-green-600">{gameState.moves}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">剩余</p>
            <p className="text-3xl font-bold text-purple-600">{activeTiles.length}</p>
          </div>
        </div>

        {/* 游戏棋盘 */}
        <div className="bg-gray-100 rounded-xl p-6 mb-8">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gameState.cols}, 1fr)` }}>
            {gameState.tiles.map(tile => {
              const isSelected = gameState.selectedTiles.includes(tile.id);
              const isRemoved = tile.isRemoved;

              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  disabled={isRemoved || gameState.gameOver}
                  className={`
                    aspect-square rounded-lg font-bold text-white
                    transition-all duration-200 transform
                    flex items-center justify-center
                    ${isRemoved ? 'opacity-0 pointer-events-none scale-0' : ''}
                    ${isSelected 
                      ? `${TILE_COLORS[tile.type]} scale-110 shadow-lg ring-4 ring-yellow-300` 
                      : `${TILE_COLORS[tile.type]} hover:scale-105 shadow-md`
                    }
                    ${gameState.gameOver ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                  `}
                >
                  <span className="text-gray-800">
                    {TILE_ICONS[tile.type]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 游戏状态提示 */}
        {gameState.gameOver && (
          <div className={`rounded-lg p-4 mb-6 text-center ${
            gameState.won 
              ? 'bg-green-100 border-2 border-green-400' 
              : 'bg-red-100 border-2 border-red-400'
          }`}>
            <p className={`text-lg font-bold ${gameState.won ? 'text-green-700' : 'text-red-700'}`}>
              {gameState.won ? '🎉 恭喜你赢了！' : '游戏结束，没有可消除的方块'}
            </p>
            {gameState.won && (
              <p className="text-gray-700 mt-2">最终分数：{gameState.score}</p>
            )}
          </div>
        )}

        {/* 按钮组 */}
        <div className="flex gap-4">
          <Button
            onClick={handleReset}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            {gameState.gameOver ? '重新开始' : '新游戏'}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg"
            disabled
          >
            提示（开发中）
          </Button>
        </div>

        {/* 游戏规则 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">游戏规则</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ 选择三个图案互不相同的方块</li>
            <li>✓ 满足条件的方块会自动消除</li>
            <li>✓ 消除所有方块即可获胜</li>
            <li>✓ 每消除一组得 30 分</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
