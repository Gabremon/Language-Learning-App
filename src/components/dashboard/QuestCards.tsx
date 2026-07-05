"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InkPanel } from "@/components/ui/ink-shell";
import { Badge } from "@/components/ui/badge";
import { DAILY_QUESTS, WEEKLY_QUEST, isQuestComplete } from "@/lib/gamification/quests";
import { useGamification } from "@/contexts/GamificationContext";
import { CheckCircle2, Circle, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuestCards() {
  const { state, claimQuest } = useGamification();
  const activity = state.questActivity;
  const [claimingId, setClaimingId] = useState<string | null>(null);

  async function handleClaim(questId: string) {
    if (claimingId) return;
    setClaimingId(questId);
    try {
      await claimQuest(questId);
    } finally {
      setClaimingId(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-stone-800">Daily quests</h2>
        <Badge variant="muted" className="text-[10px]">
          Resets at midnight
        </Badge>
      </div>

      {DAILY_QUESTS.map((quest) => {
        const progress = state.dailyQuests.find((q) => q.questId === quest.id);
        const current = progress?.progress ?? 0;
        const complete = isQuestComplete(quest, activity);
        const claimed = progress?.claimed ?? false;

        return (
          <InkPanel key={quest.id} className="p-3">
            <div className="flex items-start gap-3">
              {complete ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-stone-300" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-stone-800">{quest.title}</p>
                <p className="text-xs text-stone-500">{quest.description}</p>
                <p className="mt-1 text-[10px] font-medium text-brand-600">
                  {Math.min(current, quest.target)}/{quest.target}
                </p>
              </div>
              {complete && !claimed ? (
                <Button
                  size="sm"
                  className="h-8 shrink-0 gap-1 text-xs"
                  disabled={claimingId === quest.id}
                  onClick={() => handleClaim(quest.id)}
                >
                  <Gift className="h-3.5 w-3.5" />
                  +{quest.xpReward}
                </Button>
              ) : (
                <Badge
                  variant={claimed ? "muted" : "accent"}
                  className={cn("shrink-0 text-[10px]", claimed && "opacity-60")}
                >
                  {claimed ? "Claimed" : `+${quest.xpReward} XP`}
                </Badge>
              )}
            </div>
          </InkPanel>
        );
      })}

      <InkPanel className="border-violet-200/60 bg-violet-50/50 p-3">
        <div className="flex items-start gap-3">
          {isQuestComplete(WEEKLY_QUEST, activity) ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
          ) : (
            <Circle className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600">Weekly quest</p>
            <p className="text-sm font-semibold text-stone-800">{WEEKLY_QUEST.title}</p>
            <p className="text-xs text-stone-500">{WEEKLY_QUEST.description}</p>
            <p className="mt-1 text-[10px] font-medium text-violet-600">
              {Math.min(state.weeklyQuest.progress, WEEKLY_QUEST.target)}/{WEEKLY_QUEST.target} days
            </p>
          </div>
          {isQuestComplete(WEEKLY_QUEST, activity) && !state.weeklyQuest.claimed ? (
            <Button
              size="sm"
              className="h-8 shrink-0 gap-1 bg-violet-600 text-xs hover:bg-violet-700"
              disabled={claimingId === WEEKLY_QUEST.id}
              onClick={() => handleClaim(WEEKLY_QUEST.id)}
            >
              <Gift className="h-3.5 w-3.5" />
              +{WEEKLY_QUEST.xpReward}
            </Button>
          ) : (
            <Badge variant="muted" className="shrink-0 text-[10px]">
              {state.weeklyQuest.claimed ? "Claimed" : `+${WEEKLY_QUEST.xpReward} XP`}
            </Badge>
          )}
        </div>
      </InkPanel>
    </div>
  );
}
