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

/**
 * Calculates a user's completed age at a specific time.
 *
 * @param dateOfBirth - Stored date of birth from the member profile.
 * @param currentTime - Time at which the age should be calculated.
 * @returns The member's age in completed years.
 */
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

/**
 * Converts an internal member record into fields safe for Circle responses.
 *
 * The exact date of birth is replaced with a calculated age so it is not
 * exposed to other members.
 *
 * @param member - Member and profile data loaded from the database.
 * @param currentTime - Time used for age calculation.
 * @returns Public summary of the Circle member.
 */
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

/**
 * Requires the user to belong to a Circle cycle that is active right now.
 *
 * Returning the same not-found error for missing and inaccessible cycles
 * avoids revealing another Circle's existence.
 *
 * @param cycleId - Weekly Circle cycle being accessed.
 * @param userId - Internal ID of the requesting user.
 * @param currentTime - Time used to validate the cycle window.
 * @returns The authorised Circle summary.
 * @throws AppError with status 404 when the cycle is unavailable to the user.
 */
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

/**
 * Lists the signed-in user's active Circle assignments.
 *
 * @param userId - Internal ID of the requesting user.
 * @returns The current Circle response; the list may be empty.
 */
export async function listCurrentCircles(
  userId: number,
): Promise<CurrentCirclesResponse> {
  const circles = await circlesRepo.findCurrentByUserId(
    userId,
    new Date(),
  );

  return { circles };
}

/**
 * Loads an active Circle and its member summaries for an authorised user.
 *
 * @param cycleId - Weekly Circle cycle being requested.
 * @param userId - Internal ID of the requesting user.
 * @returns Circle details with public member summaries.
 * @throws AppError with status 404 when the user cannot access the cycle.
 */
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

/**
 * Loads one member profile through a shared active Circle membership.
 *
 * @param cycleId - Weekly Circle cycle shared by both users.
 * @param memberUserId - Internal ID of the member being viewed.
 * @param requestingUserId - Internal ID of the requesting user.
 * @returns The member's viewable Circle profile.
 * @throws AppError when the cycle or member is unavailable to the requester.
 */
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

/**
 * Returns a cursor-based page of Circle messages in chronological order.
 *
 * One extra row is requested from the repository to determine whether a
 * subsequent page exists.
 *
 * @param cycleId - Weekly Circle cycle whose chat is requested.
 * @param userId - Internal ID of the requesting member.
 * @param options - Exclusive cursor and requested page size.
 * @returns Messages and the cursor for the next older page.
 * @throws AppError with status 404 when the user cannot access the cycle.
 */
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

/**
 * Validates and sends a text message to an active Circle chat.
 *
 * @param cycleId - Weekly Circle cycle receiving the message.
 * @param userId - Internal ID of the sender.
 * @param untrimmedBody - Raw message text supplied by the client.
 * @returns The newly created Circle message.
 * @throws AppError when the cycle is inaccessible or the body is invalid.
 */
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

/**
 * Advances a member's read marker to a message in their Circle chat.
 *
 * @param cycleId - Weekly Circle cycle whose read state is changing.
 * @param userId - Internal ID of the member reading the chat.
 * @param lastReadMessageId - Latest message the member has read.
 * @returns Nothing after the marker is updated.
 * @throws AppError when the cycle or message is invalid.
 */
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
