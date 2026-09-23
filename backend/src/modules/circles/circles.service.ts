import { AppError } from "../../shared/errors/app-error.js";
import { circlesRepo } from "./circles.repository.js";
import type {
  CircleDetails,
  CircleMemberProfile,
  CircleMemberRecord,
  CircleMemberSummary,
  CircleMessage,
  CircleMessagesPage,
  CurrentCircle,
  CurrentCirclesResponse,
  MessagePageOptions,
} from "./circles.types.js";

function calculateAge(dateOfBirth: Date, currentTime: Date): number {
  const birthDate = new Date(dateOfBirth);
  let age = currentTime.getUTCFullYear() - birthDate.getUTCFullYear();
  const birthdayHasPassed =
    currentTime.getUTCMonth() > birthDate.getUTCMonth() ||
    (currentTime.getUTCMonth() === birthDate.getUTCMonth() &&
      currentTime.getUTCDate() >= birthDate.getUTCDate());

  if (!birthdayHasPassed) {
    age -= 1;
  }

  return age;
}

function toMemberSummary(
  member: CircleMemberRecord,
  currentTime: Date,
): CircleMemberSummary {
  return {
    userId: member.userId,
    displayName: member.displayName,
    age: calculateAge(member.dateOfBirth, currentTime),
    bio: member.bio,
    photoUrl: member.photoUrl,
  };
}

async function requireActiveCircle(
  cycleId: number,
  userId: number,
  currentTime = new Date(),
): Promise<CurrentCircle> {
  const cycle = await circlesRepo.findActiveCycleForMember(
    cycleId,
    userId,
    currentTime,
  );

  if (!cycle) {
    throw new AppError({
      statusCode: 404,
      code: "CIRCLE_NOT_FOUND",
      message: "Circle not found",
    });
  }

  return cycle;
}

export async function listCurrentCircles(
  userId: number,
): Promise<CurrentCirclesResponse> {
  const circles = await circlesRepo.findCurrentByUserId(
    userId,
    new Date(),
  );

  return { circles };
}

export async function getCircleForUser(
  cycleId: number,
  userId: number,
): Promise<CircleDetails> {
  const currentTime = new Date();
  const cycle = await requireActiveCircle(cycleId, userId, currentTime);
  const members = await circlesRepo.findMembers(cycleId);

  return {
    ...cycle,
    members: members.map((member) => toMemberSummary(member, currentTime)),
  };
}

export async function getCircleMemberProfile(
  cycleId: number,
  memberUserId: number,
  requestingUserId: number,
): Promise<CircleMemberProfile> {
  const currentTime = new Date();
  await requireActiveCircle(cycleId, requestingUserId, currentTime);

  const member = await circlesRepo.findMemberProfile(cycleId, memberUserId);

  if (!member) {
    throw new AppError({
      statusCode: 404,
      code: "CIRCLE_MEMBER_NOT_FOUND",
      message: "Circle member not found",
    });
  }

  return {
    ...toMemberSummary(member, currentTime),
    datingGoal: member.datingGoal,
    gender: member.gender,
  };
}

export async function listCircleMessages(
  cycleId: number,
  userId: number,
  options: MessagePageOptions,
): Promise<CircleMessagesPage> {
  await requireActiveCircle(cycleId, userId);
  const conversationId = await circlesRepo.findCircleConversation(cycleId);

  if (conversationId === null) {
    return { messages: [], nextBefore: null };
  }

  const rows = await circlesRepo.findMessages(
    conversationId,
    options.before,
    options.limit + 1,
  );
  const hasMore = rows.length > options.limit;

  if (hasMore) {
    rows.pop();
  }

  rows.reverse();

  return {
    messages: rows,
    nextBefore: hasMore ? (rows[0]?.messageId ?? null) : null,
  };
}

export async function sendCircleMessage(
  cycleId: number,
  userId: number,
  untrimmedBody: string,
): Promise<CircleMessage> {
  await requireActiveCircle(cycleId, userId);
  const body = untrimmedBody.trim();

  if (body.length === 0 || body.length > 2_000) {
    throw new AppError({
      statusCode: 400,
      code: "INVALID_MESSAGE_BODY",
      message: "Message body must contain between 1 and 2000 characters",
    });
  }

  const conversationId = await circlesRepo.ensureCircleConversation(cycleId);

  return circlesRepo.insertTextMessage(conversationId, userId, body);
}

export async function markCircleRead(
  cycleId: number,
  userId: number,
  lastReadMessageId: string,
): Promise<void> {
  await requireActiveCircle(cycleId, userId);
  const existingConversationId =
    await circlesRepo.findCircleConversation(cycleId);

  if (existingConversationId === null) {
    throw new AppError({
      statusCode: 400,
      code: "INVALID_LAST_READ_MESSAGE",
      message: "The last read message does not belong to this Circle",
    });
  }

  // Ensures the read-marker row exists if the conversation was provisioned
  // before this member joined the cycle.
  const conversationId = await circlesRepo.ensureCircleConversation(cycleId);
  const belongsToConversation = await circlesRepo.messageBelongsToConversation(
    conversationId,
    lastReadMessageId,
  );

  if (!belongsToConversation) {
    throw new AppError({
      statusCode: 400,
      code: "INVALID_LAST_READ_MESSAGE",
      message: "The last read message does not belong to this Circle",
    });
  }

  await circlesRepo.updateLastReadMessage(
    conversationId,
    userId,
    lastReadMessageId,
  );
}
