// src/pages/gamification/components/LevelProgressHeader.jsx
import React from "react";
import Icon from "components/AppIcon";

function LevelProgressHeader({
  userProgress,
  showLeaderboard,
  setShowLeaderboard,
}) {
  /* % hacia el próximo nivel */
  const progressPercentage =
    (userProgress.lifePoints / userProgress.nextLevelPoints) * 100;

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* ─── Level + avatar ─────────────────────────────── */}
        <div className="flex items-center space-x-4">
          {/* Círculo representativo */}
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {userProgress.currentLevel}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Level {userProgress.currentLevel}
            </h2>
            <p className="text-text-secondary">Nutrition Enthusiast</p>
          </div>
        </div>

        {/* ─── Barra de progreso ─────────────────────────── */}
        <div className="flex-1 lg:mx-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">
              Progress to Level {userProgress.currentLevel + 1}
            </span>
            <span className="text-sm font-data text-text-primary">
              {userProgress.lifePoints.toLocaleString()} /
              {" "}
              {userProgress.nextLevelPoints.toLocaleString()} LP
            </span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-secondary">
              {Math.round(progressPercentage)}% complete
            </span>
            <span className="text-xs text-text-secondary">
              {(userProgress.nextLevelPoints - userProgress.lifePoints).toLocaleString()} LP to go
            </span>
          </div>
        </div>

        {/* ─── Stats / acciones ──────────────────────────── */}
        <div className="flex items-center space-x-4">
          {/* Métricas (ocultas en móviles) */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center space-x-1">
                <Icon name="Flame" size={16} className="text-warning" />
                <span className="text-lg font-bold text-text-primary">
                  {userProgress.weeklyStreak}
                </span>
              </div>
              <span className="text-xs text-text-secondary">Day Streak</span>
            </div>

            <div className="text-center">
              <div className="flex items-center space-x-1">
                <Icon name="Award" size={16} className="text-accent" />
                <span className="text-lg font-bold text-text-primary">
                  {userProgress.totalAchievements}
                </span>
              </div>
              <span className="text-xs text-text-secondary">Achievements</span>
            </div>
          </div>

          {/* Botón leaderboard */}
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth
              ${showLeaderboard
                ? "bg-primary text-white"
                : "bg-background text-text-primary hover:bg-gray-100"}`}
          >
            <Icon name="Users" size={18} />
            <span className="font-medium hidden sm:inline">
              {showLeaderboard ? "Hide" : "Show"} Leaderboard
            </span>
          </button>
        </div>
      </div>

      {/* Stats móviles */}
      <div className="sm:hidden flex items-center justify-around mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <Icon name="Flame" size={16} className="text-warning" />
            <span className="text-lg font-bold text-text-primary">
              {userProgress.weeklyStreak}
            </span>
          </div>
          <span className="text-xs text-text-secondary">Day Streak</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <Icon name="Award" size={16} className="text-accent" />
            <span className="text-lg font-bold text-text-primary">
              {userProgress.totalAchievements}
            </span>
          </div>
          <span className="text-xs text-text-secondary">Achievements</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <Icon name="Target" size={16} className="text-success" />
            <span className="text-lg font-bold text-text-primary">
              {userProgress.completedChallenges}
            </span>
          </div>
          <span className="text-xs text-text-secondary">Challenges</span>
        </div>
      </div>
    </div>
  );
}

export default LevelProgressHeader;
