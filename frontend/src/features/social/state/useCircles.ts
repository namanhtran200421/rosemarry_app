import { useCallback, useState } from "react";

import { NIGHT_OWLS } from "../data/circle-night-owls";
import { TRAILBLAZERS } from "../data/circle-trailblazers";
import { CIRCLE_REPLIES } from "../data/people";
import type {
  ActivityResult,
  Circle,
  CircleActivity,
} from "../types/circle.types";

import { useTimeouts } from "./useTimeouts";

function completeActivity(
  activity: CircleActivity,
  result: ActivityResult,
): CircleActivity {
  const done = { done: true, count: activity.count + 1 };
  if (activity.type === "flirty") {
    return { ...activity, ...done, myAnswer: String(result) };
  }
  return { ...activity, ...done, result } as CircleActivity;
}

/**
 * Weekly circles: the group thread and the daily activities. Paid members see
 * both demo circles; free members see the first.
 */
export function useCircles(isPaid: boolean) {
  const schedule = useTimeouts();
  const [circles, setCircles] = useState<Circle[]>([NIGHT_OWLS, TRAILBLAZERS]);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleCircles = isPaid ? circles : circles.slice(0, 1);
  const index = Math.min(activeIndex, visibleCircles.length - 1);
  const circle = visibleCircles[index];

  const patchCircle = useCallback(
    (circleId: string, update: (circle: Circle) => Circle) => {
      setCircles((current) =>
        current.map((item) => (item.id === circleId ? update(item) : item)),
      );
    },
    [],
  );

  const sendCircleMessage = useCallback(
    (circleId: string, text: string, image?: string) => {
      patchCircle(circleId, (item) => ({
        ...item,
        unread: 0,
        messages: [...item.messages, { from: "me", text, image }],
      }));
      schedule(() => {
        patchCircle(circleId, (item) => {
          const member =
            item.members[Math.floor(Math.random() * item.members.length)];
          const reply =
            CIRCLE_REPLIES[Math.floor(Math.random() * CIRCLE_REPLIES.length)];
          return {
            ...item,
            messages: [...item.messages, { from: member.id, text: reply }],
          };
        });
      }, 1100);
    },
    [patchCircle, schedule],
  );

  /** Finishing an activity records its result; nothing is posted to chat. */
  const finishActivity = useCallback(
    (circleId: string, activityId: string, result: ActivityResult) => {
      patchCircle(circleId, (item) => ({
        ...item,
        activities: item.activities.map((activity) =>
          activity.id === activityId && !activity.done
            ? completeActivity(activity, result)
            : activity,
        ),
      }));
    },
    [patchCircle],
  );

  const toggleSetting = useCallback(
    (circleId: string, key: keyof Circle["settings"]) => {
      patchCircle(circleId, (item) => ({
        ...item,
        settings: { ...item.settings, [key]: !item.settings[key] },
      }));
    },
    [patchCircle],
  );

  const markRead = useCallback(
    (circleId: string) => patchCircle(circleId, (item) => ({ ...item, unread: 0 })),
    [patchCircle],
  );

  return {
    circle,
    circles: visibleCircles,
    activeCircleIndex: index,
    setActiveCircleIndex: setActiveIndex,
    sendCircleMessage,
    finishActivity,
    toggleSetting,
    markRead,
  };
}
