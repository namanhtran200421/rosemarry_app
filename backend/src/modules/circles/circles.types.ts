export interface CurrentCircle {
  circleId: number;
  cycleId: number;
  name: string;
  startsAt: Date;
  endsAt: Date;
}

export interface CurrentCirclesResponse {
  circles: CurrentCircle[];
}

export interface CircleMemberRecord {
  userId: number;
  displayName: string;
  dateOfBirth: Date;
  bio: string | null;
  photoUrl: string | null;
}

export interface CircleMemberSummary {
  userId: number;
  displayName: string;
  age: number;
  bio: string | null;
  photoUrl: string | null;
}

export interface CircleMemberProfileRecord extends CircleMemberRecord {
  datingGoal: string | null;
  gender: string | null;
}

export interface CircleMemberProfile extends CircleMemberSummary {
  datingGoal: string | null;
  gender: string | null;
}

export interface CircleDetails extends CurrentCircle {
  members: CircleMemberSummary[];
}

export type CircleMessageType = "text" | "media" | "system";

export interface CircleMessage {
  messageId: string;
  userId: number | null;
  displayName: string | null;
  messageType: CircleMessageType;
  body: string | null;
  createdAt: Date;
}

export interface CircleMessagesPage {
  messages: CircleMessage[];
  nextBefore: string | null;
}

export interface MessagePageOptions {
  before?: string;
  limit: number;
}
