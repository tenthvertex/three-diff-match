import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Gamepad2, Star, Zap, Trophy } from "lucide-react";

/**
 * 首页 - 游戏介绍和入口
 * 设计理念：现代、清爽、游戏感十足
 */
export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">三异连连看</h1>
          </div>
          <Button
            onClick={() => navigate("/game")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            开始游戏
          </Button>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* 英雄部分 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
              挑战你的<span className="text-blue-600">逻辑思维</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              一款充满趣味的消除类游戏。选择三个图案互不相同的方块，看你能消除多少！
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/game")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 text-lg rounded-lg"
              >
                立即开始
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 font-semibold py-6 px-8 text-lg rounded-lg"
              >
                查看规则
              </Button>
            </div>
          </div>

          {/* 游戏预览 */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="grid grid-cols-3 gap-2 mb-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg shadow-md flex items-center justify-center text-white text-2xl font-bold hover:scale-105 transition-transform"
                >
                  {i % 3 === 0 ? "★" : i % 3 === 1 ? "●" : "■"}
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm">游戏界面预览</p>
          </div>
        </div>

        {/* 特性卡片 */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">简单易学</h3>
            <p className="text-gray-600">
              规则简单易懂，选择三个不同图案的方块即可消除，老少皆宜。
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">快速上手</h3>
            <p className="text-gray-600">
              无需复杂教程，打开即玩。流畅的游戏体验让你沉浸其中。
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">挑战自我</h3>
            <p className="text-gray-600">
              每局游戏都是新的挑战，看你能获得多少分数，超越自己的记录。
            </p>
          </div>
        </div>

        {/* 游戏规则详解 */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">游戏规则</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                核心规则
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>点击选择方块，最多可选择 3 个</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>选中的三个方块图案必须互不相同</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>满足条件的方块会自动消除</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                计分规则
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">★</span>
                  <span>每消除一组方块得 30 分</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">★</span>
                  <span>消除所有方块即可获胜</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">★</span>
                  <span>无可消除的方块时游戏结束</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">准备好了吗？</h2>
          <p className="text-lg mb-8 opacity-90">
            现在就开始游戏，挑战你的逻辑思维能力！
          </p>
          <Button
            onClick={() => navigate("/game")}
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 text-lg rounded-lg"
          >
            开始游戏
          </Button>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2026 三异连连看 - 享受游戏，挑战自我</p>
        </div>
      </footer>
    </div>
  );
}
