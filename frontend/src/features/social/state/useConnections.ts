import { useCallback, useState } from "react";

import { ICEBREAKER_REPLIES } from "../data/catalogs";
import { LIKES_YOU, seedMatches } from "../data/people";
import type {
  ChatMessage,
  LikeSource,
  Match,
  PersonSummary,
  Profile,
} from "../types/social.types";

import { useTimeouts } from "./useTimeouts";

function toSummary(person: Profile | PersonSummary): PersonSummary {
  const photo = "photo" in person ? person.photo : (person.photos[0] ?? "");
  return {
    id: person.id,
    name: person.name.split(" ")[0],
    age: person.age,
    photo,
  };
}

/**
 * Likes, matches and one-to-one conversations. Replies from matches are
 * simulated so threads feel alive until messaging is backed by the API.
 */
export function useConnections() {
  const schedule = useTimeouts();
  const [likesYou, setLikesYou] = useState<PersonSummary[]>(LIKES_YOU);
  const [likesSent, setLikesSent] = useState<PersonSummary[]>([]);
  const [matches, setMatches] = useState<Match[]>(() => seedMatches(Date.now()));
  const [conversations, setConversations] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [firstMessaged, setFirstMessaged] = useState<string[]>([]);
  const [matchPopup, setMatchPopup] = useState<Match | null>(null);

  const appendMessages = useCallback(
    (matchId: string, messages: ChatMessage[]) => {
      setConversations((current) => ({
        ...current,
        [matchId]: [...(current[matchId] ?? []), ...messages],
      }));
    },
    [],
  );

  const addMatch = useCallback((person: Profile | PersonSummary): Match => {
    const match = { ...toSummary(person), matchedAt: Date.now() };
    setMatches((current) =>
      current.some((item) => item.id === match.id) ? current : [match, ...current],
    );
    return match;
  }, []);

  const recordLike = useCallback(
    (person: Profile | PersonSummary, superliked: boolean, source: LikeSource) => {
      const summary = { ...toSummary(person), superliked, source };
      setLikesSent((current) => {
        const existing = current.find((item) => item.id === summary.id);
        if (!existing) {
          return [summary, ...current];
        }
        return superliked && !existing.superliked
          ? current.map((item) =>
              item.id === summary.id ? { ...item, superliked: true } : item,
            )
          : current;
      });
    },
    [],
  );

  const matchWith = useCallback(
    (person: Profile | PersonSummary) => {
      const match = addMatch(person);
      setLikesYou((current) => current.filter((item) => item.id !== person.id));
      setLikesSent((current) => current.filter((item) => item.id !== person.id));
      setMatchPopup(match);
    },
    [addMatch],
  );

  const passLike = useCallback((personId: string) => {
    setLikesYou((current) => current.filter((item) => item.id !== personId));
  }, []);

  const sendMessage = useCallback(
    (matchId: string, text: string) => {
      appendMessages(matchId, [{ from: "me", text }]);
      schedule(() => {
        setConversations((current) => {
          const thread = current[matchId] ?? [];
          if (thread.some((message) => message.from === "them")) {
            return current;
          }
          return {
            ...current,
            [matchId]: [
              ...thread,
              { from: "them", text: "Hey! Great to match with you 😊" },
            ],
          };
        });
      }, 900);
    },
    [appendMessages, schedule],
  );

  const answerIceBreaker = useCallback(
    (matchId: string, prompt: string, answer: string) => {
      const opener =
        ICEBREAKER_REPLIES[Math.floor(Math.random() * ICEBREAKER_REPLIES.length)];
      appendMessages(matchId, [
        { from: "system", text: prompt },
        { from: "me", text: answer },
      ]);
      schedule(() => {
        appendMessages(matchId, [
          {
            from: "them",
            text: `${opener} …still deciding, but I love that you said that 😄`,
          },
        ]);
      }, 1100);
    },
    [appendMessages, schedule],
  );

  /** A first-impression message opens a chat before the two people match. */
  const sendFirstImpression = useCallback(
    (person: Profile | PersonSummary, text: string) => {
      addMatch(person);
      setFirstMessaged((current) =>
        current.includes(person.id) ? current : [...current, person.id],
      );
      sendMessage(person.id, text);
    },
    [addMatch, sendMessage],
  );

  return {
    likesYou,
    likesSent,
    matches,
    conversations,
    firstMessaged,
    matchPopup,
    recordLike,
    matchWith,
    passLike,
    sendMessage,
    answerIceBreaker,
    sendFirstImpression,
    dismissMatchPopup: () => setMatchPopup(null),
  };
}
