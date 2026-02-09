/**
 * 三异连连看游戏逻辑 - 微信小程序版本
 * 规则：选中三个图案互不相同的方块即可消去
 */

const TILE_TYPES = ['star', 'circle', 'square', 'triangle', 'diamond', 'heart', 'flower', 'moon'];

/**
 * 初始化游戏状态
 */
function initializeGame(rows = 6, cols = 6) {
  const tiles = [];
  let id = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const randomType = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
      tiles.push({
        id: `tile-${id++}`,
        type: randomType,
        row,
        col,
        isRemoved: false,
      });
    }
  }

  return {
    tiles,
    selectedTiles: [],
    score: 0,
    moves: 0,
    gameOver: false,
    won: false,
    rows,
    cols,
  };
}

/**
 * 选中一个方块
 */
function selectTile(gameState, tileId) {
  const newState = JSON.parse(JSON.stringify(gameState)); // 深拷贝
  const selectedTiles = [...newState.selectedTiles];

  // 如果已经选中，则取消选中
  if (selectedTiles.includes(tileId)) {
    newState.selectedTiles = selectedTiles.filter(id => id !== tileId);
    return newState;
  }

  // 最多选择 3 个
  if (selectedTiles.length >= 3) {
    return newState;
  }

  selectedTiles.push(tileId);
  newState.selectedTiles = selectedTiles;

  // 如果选中了 3 个，检查是否可以消除
  if (selectedTiles.length === 3) {
    const canRemove = checkRemoveCondition(newState, selectedTiles);
    if (canRemove) {
      return removeTiles(newState, selectedTiles);
    } else {
      // 不符合条件，清空选中
      newState.selectedTiles = [];
    }
  }

  return newState;
}

/**
 * 检查是否满足消除条件：三个方块图案互不相同
 */
function checkRemoveCondition(gameState, selectedTileIds) {
  if (selectedTileIds.length !== 3) {
    return false;
  }

  const types = selectedTileIds.map(id => {
    const tile = gameState.tiles.find(t => t.id === id);
    return tile ? tile.type : null;
  });

  // 检查三个类型是否互不相同
  const uniqueTypes = new Set(types);
  return uniqueTypes.size === 3;
}

/**
 * 消除方块
 */
function removeTiles(gameState, tileIds) {
  const newState = JSON.parse(JSON.stringify(gameState)); // 深拷贝
  
  newState.tiles = newState.tiles.map(tile => {
    if (tileIds.includes(tile.id)) {
      return Object.assign({}, tile, { isRemoved: true });
    }
    return tile;
  });

  newState.selectedTiles = [];
  newState.score += 30; // 每消除一组得 30 分
  newState.moves += 1;

  // 检查游戏是否结束
  const remainingTiles = newState.tiles.filter(t => !t.isRemoved);
  if (remainingTiles.length === 0) {
    newState.won = true;
    newState.gameOver = true;
  }

  return newState;
}

/**
 * 重置游戏
 */
function resetGame() {
  return initializeGame(6, 6);
}

/**
 * 获取可消除的方块组合（用于提示功能）
 */
function getAvailableMoves(gameState) {
  const availableMoves = [];
  const activeTiles = gameState.tiles.filter(t => !t.isRemoved);

  for (let i = 0; i < activeTiles.length; i++) {
    for (let j = i + 1; j < activeTiles.length; j++) {
      for (let k = j + 1; k < activeTiles.length; k++) {
        const types = [activeTiles[i].type, activeTiles[j].type, activeTiles[k].type];
        const uniqueTypes = new Set(types);
        
        if (uniqueTypes.size === 3) {
          availableMoves.push([activeTiles[i].id, activeTiles[j].id, activeTiles[k].id]);
        }
      }
    }
  }

  return availableMoves;
}

/**
 * 检查游戏是否无法继续
 */
function checkGameOver(gameState) {
  const availableMoves = getAvailableMoves(gameState);
  return availableMoves.length === 0 && !gameState.won;
}

// 导出函数供小程序使用
module.exports = {
  initializeGame,
  selectTile,
  checkRemoveCondition,
  removeTiles,
  resetGame,
  getAvailableMoves,
  checkGameOver
};
