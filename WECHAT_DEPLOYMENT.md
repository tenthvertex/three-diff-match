# 三异连连看 - 微信小程序发布指南

## 项目概述
**游戏名称**: 三异连连看  
**游戏类型**: 消除类益智游戏  
**核心规则**: 选择三个图案互不相同的方块即可消除  
**技术栈**: React 19 + Tailwind CSS 4 + TypeScript

---

## 发布前准备

### 1. 注册微信小程序账号
- 访问 [微信小程序官方平台](https://mp.weixin.qq.com/)
- 点击"立即注册"
- 选择"小程序"
- 填写邮箱、密码等基本信息
- 完成邮箱验证

### 2. 完成小程序认证
- 登录小程序后台
- 进入"设置" → "基本信息"
- 点击"认证"按钮
- 选择认证类型（个人或企业）
- 上传相关证件并支付认证费用（300元）
- 等待审核（通常 1-3 个工作日）

### 3. 获取 AppID 和 AppSecret
- 登录小程序后台
- 进入"设置" → "开发设置"
- 查看 **AppID**（小程序 ID）
- 点击"生成"获取 **AppSecret**（小程序密钥）
- **保管好这两个凭证，不要泄露！**

---

## 代码转换指南

### 当前项目状态
本项目是基于 **React + Web 技术**开发的，需要转换为微信小程序原生代码。

### 转换步骤

#### 步骤 1: 安装微信开发者工具
- 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 选择对应操作系统版本
- 安装完成后打开

#### 步骤 2: 创建小程序项目
1. 打开微信开发者工具
2. 点击"+"创建新项目
3. 填写项目信息：
   - **项目名称**: 三异连连看
   - **项目目录**: 选择一个空目录
   - **AppID**: 粘贴刚才获取的 AppID
   - **开发框架**: 选择"小程序"
4. 点击"创建"

#### 步骤 3: 项目结构转换

微信小程序的基本结构如下：

```
miniprogram/
├── app.js              # 小程序入口
├── app.json            # 小程序全局配置
├── app.wxss            # 全局样式
├── pages/
│   ├── game/
│   │   ├── game.js     # 游戏页面逻辑
│   │   ├── game.json   # 页面配置
│   │   ├── game.wxml   # 页面模板
│   │   └── game.wxss   # 页面样式
│   └── index/
│       ├── index.js    # 首页逻辑
│       ├── index.json  # 页面配置
│       ├── index.wxml  # 页面模板
│       └── index.wxss  # 页面样式
└── utils/
    └── gameLogic.js    # 游戏逻辑（可复用）
```

#### 步骤 4: 核心文件转换

**app.json** - 全局配置
```json
{
  "pages": [
    "pages/index/index",
    "pages/game/game"
  ],
  "window": {
    "backgroundColor": "#ffffff",
    "navigationBarBackgroundColor": "#2563eb",
    "navigationBarTitleText": "三异连连看",
    "navigationBarTextStyle": "white"
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

**pages/game/game.wxml** - 游戏页面模板
```xml
<view class="container">
  <view class="header">
    <text class="title">三异连连看</text>
    <text class="subtitle">选择三个不同图案的方块来消除它们</text>
  </view>

  <view class="stats">
    <view class="stat-item">
      <text class="stat-label">分数</text>
      <text class="stat-value">{{score}}</text>
    </view>
    <view class="stat-item">
      <text class="stat-label">步数</text>
      <text class="stat-value">{{moves}}</text>
    </view>
    <view class="stat-item">
      <text class="stat-label">剩余</text>
      <text class="stat-value">{{remainingTiles}}</text>
    </view>
  </view>

  <view class="game-board">
    <view class="tile-grid">
      <block wx:for="{{tiles}}" wx:key="id">
        <view 
          wx:if="{{!item.isRemoved}}"
          class="tile {{selectedTiles.includes(item.id) ? 'selected' : ''}}"
          style="background-color: {{tileColors[item.type]}}"
          bindtap="handleTileClick"
          data-tile-id="{{item.id}}"
        >
          <text class="tile-icon">{{tileIcons[item.type]}}</text>
        </view>
      </block>
    </view>
  </view>

  <view wx:if="{{gameOver}}" class="game-over {{won ? 'won' : 'lost'}}">
    <text class="game-over-text">{{won ? '🎉 恭喜你赢了！' : '游戏结束'}}</text>
    <text wx:if="{{won}}" class="final-score">最终分数：{{score}}</text>
  </view>

  <view class="buttons">
    <button class="btn-primary" bindtap="handleReset">{{gameOver ? '重新开始' : '新游戏'}}</button>
    <button class="btn-secondary" disabled="true">提示（开发中）</button>
  </view>

  <view class="rules">
    <text class="rules-title">游戏规则</text>
    <view class="rules-item">✓ 选择三个图案互不相同的方块</view>
    <view class="rules-item">✓ 满足条件的方块会自动消除</view>
    <view class="rules-item">✓ 消除所有方块即可获胜</view>
    <view class="rules-item">✓ 每消除一组得 30 分</view>
  </view>
</view>
```

**pages/game/game.js** - 游戏逻辑
```javascript
const gameLogic = require('../../utils/gameLogic');

Page({
  data: {
    score: 0,
    moves: 0,
    selectedTiles: [],
    tiles: [],
    gameOver: false,
    won: false,
    remainingTiles: 36,
    tileIcons: {
      star: '★',
      circle: '●',
      square: '■',
      triangle: '▲',
      diamond: '◆',
      heart: '♥',
      flower: '❀',
      moon: '☾'
    },
    tileColors: {
      star: '#fbbf24',
      circle: '#60a5fa',
      square: '#f87171',
      triangle: '#4ade80',
      diamond: '#a78bfa',
      heart: '#ec4899',
      flower: '#fb923c',
      moon: '#818cf8'
    }
  },

  onLoad() {
    this.initializeGame();
  },

  initializeGame() {
    const gameState = gameLogic.initializeGame(6, 6);
    this.setData({
      tiles: gameState.tiles,
      score: gameState.score,
      moves: gameState.moves,
      selectedTiles: gameState.selectedTiles,
      gameOver: gameState.gameOver,
      won: gameState.won,
      remainingTiles: gameState.tiles.filter(t => !t.isRemoved).length
    });
  },

  handleTileClick(e) {
    const tileId = e.currentTarget.dataset.tileId;
    const gameState = gameLogic.selectTile(this.data, tileId);
    
    this.setData({
      tiles: gameState.tiles,
      score: gameState.score,
      moves: gameState.moves,
      selectedTiles: gameState.selectedTiles,
      gameOver: gameState.gameOver,
      won: gameState.won,
      remainingTiles: gameState.tiles.filter(t => !t.isRemoved).length
    });

    if (gameLogic.checkGameOver(gameState)) {
      this.setData({ gameOver: true });
    }
  },

  handleReset() {
    this.initializeGame();
  }
});
```

#### 步骤 5: 样式转换

**pages/game/game.wxss** - 小程序样式
```wxss
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #eff6ff, #f3e8ff);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #1f2937;
  display: block;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
}

.stats {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 500px;
}

.stat-item {
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  display: block;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #2563eb;
}

.game-board {
  background: #f3f4f6;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 500px;
}

.tile-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.tile {
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.tile.selected {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 3px solid #fcd34d;
}

.game-over {
  background: #f0fdf4;
  border: 2px solid #4ade80;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
}

.game-over.lost {
  background: #fef2f2;
  border-color: #f87171;
}

.game-over-text {
  font-size: 18px;
  font-weight: bold;
  color: #16a34a;
}

.game-over.lost .game-over-text {
  color: #dc2626;
}

.final-score {
  display: block;
  margin-top: 10px;
  color: #6b7280;
}

.buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  border: none;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-secondary {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.rules {
  background: white;
  border-radius: 10px;
  padding: 15px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rules-title {
  font-weight: bold;
  color: #1f2937;
  display: block;
  margin-bottom: 10px;
}

.rules-item {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 5px;
}
```

---

## 发布流程

### 1. 上传代码
- 在微信开发者工具中，点击"上传"
- 填写版本号（如 1.0.0）
- 填写项目备注（如"首个版本发布"）
- 点击"上传"

### 2. 提交审核
- 登录小程序后台
- 进入"版本管理" → "开发版本"
- 找到刚上传的版本
- 点击"提交审核"
- 填写审核信息：
  - **功能描述**: 描述游戏玩法
  - **测试账号**: 填写测试账号（可选）
  - **备注**: 补充说明

### 3. 等待审核
- 微信通常在 1-3 个工作日内完成审核
- 审核通过后会收到邮件通知
- 审核失败也会收到反馈，根据反馈修改后重新提交

### 4. 发布上线
- 审核通过后，进入"版本管理" → "审核版本"
- 点击"发布"
- 小程序即可在微信中搜索到

---

## 常见问题

### Q: 游戏会被拒审吗？
**A**: 只要游戏内容合规（无色情、暴力、赌博等），通常不会被拒审。建议：
- 确保游戏规则清晰
- 提供完整的游戏说明
- 避免诱导分享或点赞

### Q: 如何获得更多用户？
**A**: 
- 优化小程序名称和描述，包含关键词
- 在社交媒体上宣传
- 邀请朋友体验并分享
- 定期更新游戏内容

### Q: 如何实现排行榜功能？
**A**: 需要后端服务器支持。可以：
- 使用云开发（微信官方提供）
- 自建后端服务器
- 使用第三方 BaaS 服务（如 LeanCloud）

### Q: 如何添加广告获利？
**A**: 
- 在小程序后台申请广告位
- 审核通过后在游戏中集成广告代码
- 获得的收入会定期结算到账户

---

## 技术支持

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信小程序开发者社区](https://developers.weixin.qq.com/community/develop)
- [游戏开发最佳实践](https://developers.weixin.qq.com/miniprogram/dev/framework/game/)

---

## 许可证
本项目开源，可自由使用和修改。

**祝您的小程序发布顺利！** 🚀
