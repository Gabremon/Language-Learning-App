"use client";

import { InkPanel } from "@/components/ui/ink-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ACHIEVEMENTS, COSMETICS, getAchievementById } from "@/lib/gamification/achievements";
import { useGamification } from "@/contexts/GamificationContext";
import { cn } from "@/lib/utils";

export function AchievementShowcase() {
  const { state, level, equipCosmetic, recentUnlocks } = useGamification();

  return (
    <div className="space-y-4">
      <InkPanel className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-bold text-stone-800">Level {level.level}</p>
          <Badge variant="accent">{level.title}</Badge>
        </div>
        <p className="text-xs text-stone-500">
          {level.currentXp - level.xpForCurrentLevel} / {level.xpForNextLevel - level.xpForCurrentLevel} XP to next level
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-violet-500 transition-all"
            style={{ width: `${level.progressPct}%` }}
          />
        </div>
      </InkPanel>

      {state.xpLedger.length > 0 && (
        <InkPanel className="p-4">
          <p className="mb-2 text-sm font-bold text-stone-800">Recent XP</p>
          <div className="space-y-1.5">
            {state.xpLedger.slice(0, 8).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-xs"
              >
                <span className="truncate text-stone-600">{entry.label}</span>
                <span className="shrink-0 font-semibold text-amber-600">+{entry.amount}</span>
              </div>
            ))}
          </div>
        </InkPanel>
      )}

      <InkPanel className="p-4">
        <p className="mb-3 text-sm font-bold text-stone-800">Badges</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ACHIEVEMENTS.map((ach) => {
            const earned = state.earnedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={cn(
                  "rounded-xl border p-2 text-center transition",
                  earned
                    ? "border-amber-200 bg-amber-50"
                    : "border-stone-100 bg-stone-50 opacity-50"
                )}
                title={ach.description}
              >
                <span className="text-2xl">{ach.emoji}</span>
                <p className="mt-1 text-[10px] font-semibold text-stone-700">{ach.title}</p>
              </div>
            );
          })}
        </div>
      </InkPanel>

      {state.unlockedCosmetics.length > 0 && (
        <InkPanel className="p-4">
          <p className="mb-3 text-sm font-bold text-stone-800">Cosmetics</p>
          <div className="flex flex-wrap gap-2">
            {state.unlockedCosmetics.map((id) => {
              const cosmetic = COSMETICS[id];
              if (!cosmetic) return null;
              const equipped = state.equippedCosmetic === id;
              return (
                <Button
                  key={id}
                  size="sm"
                  variant={equipped ? "default" : "secondary"}
                  className="gap-1 text-xs"
                  onClick={() => equipCosmetic(equipped ? null : id)}
                >
                  {cosmetic.emoji} {cosmetic.name}
                </Button>
              );
            })}
          </div>
        </InkPanel>
      )}

      {recentUnlocks.length > 0 && (
        <p className="text-center text-xs text-amber-600">
          New badge: {getAchievementById(recentUnlocks[0])?.title}
        </p>
      )}
    </div>
  );
}
