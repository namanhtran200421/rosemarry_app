import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

import { DEFAULT_FILTERS, findPlan } from "../data/plans";
import type {
  CurrentUser,
  Filters,
  PlanId,
  Profile,
  PurchaseType,
} from "../types/social.types";

import { useCircles } from "./useCircles";
import { useConnections } from "./useConnections";

type Connections = ReturnType<typeof useConnections>;
type Circles = ReturnType<typeof useCircles>;

export interface SocialContextValue extends Connections, Circles {
  user: CurrentUser;
  updateUser: (patch: Partial<CurrentUser>) => void;
  applyPlan: (planId: PlanId) => void;
  addPurchase: (type: PurchaseType, quantity: number) => void;
  /** Spends a Super Like; returns false when none are left. */
  spendSuperlike: (profile: Profile) => boolean;
  /** Spends a First Message credit; returns false when none are left. */
  spendFirstMessage: () => boolean;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  seenToday: number;
  setSeenToday: (update: (seen: number) => number) => void;
  showCompletePrompt: boolean;
  dismissCompletePrompt: () => void;
}

const SocialContext = createContext<SocialContextValue | null>(null);

interface SocialProviderProps extends PropsWithChildren {
  initialUser: CurrentUser;
  /** New sign-ups are nudged to finish their profile on arrival. */
  isNewMember: boolean;
}

/**
 * In-memory state for the main app tabs. Discover, likes, chat and circles
 * run on demo data here until their backend endpoints exist.
 */
export function SocialProvider({
  initialUser,
  isNewMember,
  children,
}: SocialProviderProps) {
  const [user, setUser] = useState<CurrentUser>(initialUser);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [seenToday, setSeenToday] = useState(0);
  const [showCompletePrompt, setShowCompletePrompt] = useState(isNewMember);
  const connections = useConnections();
  const circles = useCircles(user.plan === "advanced");
  const { recordLike } = connections;

  const updateUser = useCallback((patch: Partial<CurrentUser>) => {
    setUser((current) => ({ ...current, ...patch }));
  }, []);

  const applyPlan = useCallback((planId: PlanId) => {
    const plan = findPlan(planId);
    setUser((current) => ({
      ...current,
      plan: plan.id,
      superlikes: plan.superlikes,
      firstMessages: plan.firstMessages,
    }));
  }, []);

  const addPurchase = useCallback((type: PurchaseType, quantity: number) => {
    setUser((current) =>
      type === "superlike"
        ? { ...current, superlikes: current.superlikes + quantity }
        : { ...current, firstMessages: current.firstMessages + quantity },
    );
  }, []);

  const spendSuperlike = useCallback(
    (profile: Profile) => {
      if (user.superlikes <= 0) {
        return false;
      }
      setUser((current) => ({ ...current, superlikes: current.superlikes - 1 }));
      recordLike(profile, true, "discover");
      return true;
    },
    [recordLike, user.superlikes],
  );

  const spendFirstMessage = useCallback(() => {
    if (user.firstMessages <= 0) {
      return false;
    }
    setUser((current) => ({
      ...current,
      firstMessages: current.firstMessages - 1,
    }));
    return true;
  }, [user.firstMessages]);

  const value: SocialContextValue = {
    ...connections,
    ...circles,
    user,
    updateUser,
    applyPlan,
    addPurchase,
    spendSuperlike,
    spendFirstMessage,
    filters,
    setFilters,
    seenToday,
    setSeenToday,
    showCompletePrompt,
    dismissCompletePrompt: () => setShowCompletePrompt(false),
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocial(): SocialContextValue {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocial must be used within a SocialProvider");
  }
  return context;
}
