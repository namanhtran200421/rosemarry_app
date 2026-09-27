import { sql } from "kysely";

import { db } from "../../infrastructure/database/database.js";
import type {
  CircleMemberProfileRecord,
  CircleMemberRecord,
  CircleMessage,
  CurrentCircle,
} from "./circles.types.js";
/**
 * Selects one display photo for the member in the surrounding Circle query.
 *
 * The primary photo is preferred. Photo order provides a deterministic
 * fallback when the member has no photo marked as primary.
 */
const memberPhotoUrl = sql<string | null>`(
  select medias.media_url
  from profile_photos
  inner join medias on medias.media_id = profile_photos.media_id
  where profile_photos.user_id = circle_members.user_id
  order by profile_photos.is_primary desc, profile_photos.photo_order asc
  limit 1
)`.as("photoUrl");

/**
 * Finds every active Circle cycle currently assigned to a user.
 *
 *
 * @param userId - Internal ID of the user whose assignments are requested.
 * @param currentTime - Time used to determine whether each cycle is current.
 * @returns The user's current Circle summaries, newest cycle first.
 */
async function findCurrentByUserId(
  userId: number,
  currentTime: Date,
): Promise<CurrentCircle[]> {
  return db
    .selectFrom("circleMembers")
    .innerJoin(
      "circleCycles",
      "circleCycles.cycleId",
      "circleMembers.cycleId",
    )
    .innerJoin("circles", "circles.circleId", "circleCycles.circleId")
    .select([
      "circles.circleId",
      "circleCycles.cycleId",
      "circles.name",
      "circleCycles.startsAt",
      "circleCycles.endsAt",
    ])
    .where("circleMembers.userId", "=", userId)
    .where("circleMembers.leftAt", "is", null)
    .where("circles.status", "=", "active")
    .where("circleCycles.status", "=", "active")
    .where("circleCycles.startsAt", "<=", currentTime)
    .where("circleCycles.endsAt", ">", currentTime)
    .orderBy("circleCycles.startsAt", "desc")
    .execute();
}

/**
 * Finds a specific active cycle only when the user is a current member.
 *
 * This query acts as the database portion of Circle authorization checks.
 * A missing, inactive, future, expired or departed membership returns null.
 *
 * @param cycleId - Weekly Circle cycle being accessed.
 * @param userId - Internal ID of the requesting user.
 * @param currentTime - Time used to validate the cycle window.
 * @returns The Circle summary when access is valid, otherwise null.
 */
async function findActiveCycleForMember(
  cycleId: number,
  userId: number,
  currentTime: Date,
): Promise<CurrentCircle | null> {
  const cycle = await db
    .selectFrom("circleMembers")
    .innerJoin(
      "circleCycles",
      "circleCycles.cycleId",
      "circleMembers.cycleId",
    )
    .innerJoin("circles", "circles.circleId", "circleCycles.circleId")
    .select([
      "circles.circleId",
      "circleCycles.cycleId",
      "circles.name",
      "circleCycles.startsAt",
      "circleCycles.endsAt",
    ])
    .where("circleMembers.cycleId", "=", cycleId)
    .where("circleMembers.userId", "=", userId)
    .where("circleMembers.leftAt", "is", null)
    .where("circles.status", "=", "active")
    .where("circleCycles.status", "=", "active")
    .where("circleCycles.startsAt", "<=", currentTime)
    .where("circleCycles.endsAt", ">", currentTime)
    .executeTakeFirst();

  return cycle ?? null;
}

/**
 * Lists the active members and basic profile data for a Circle cycle.
 *
 * @param cycleId - Weekly Circle cycle whose members are requested.
 * @returns Active member records in join order.
 */
async function findMembers(cycleId: number): Promise<CircleMemberRecord[]> {
  return db
    .selectFrom("circleMembers")
    .innerJoin("profiles", "profiles.userId", "circleMembers.userId")
    .select([
      "circleMembers.userId",
      "profiles.displayName",
      "profiles.dateOfBirth",
      "profiles.bio",
      memberPhotoUrl,
    ])
    .where("circleMembers.cycleId", "=", cycleId)
    .where("circleMembers.leftAt", "is", null)
    .orderBy("circleMembers.joinedAt", "asc")
    .execute();
}

/**
 * Finds the viewable profile fields for one active member of a cycle.
 *
 * @param cycleId - Weekly Circle cycle providing the relationship.
 * @param memberUserId - Internal ID of the member being viewed.
 * @returns The member profile, or null when they are not an active member.
 */
async function findMemberProfile(
  cycleId: number,
  memberUserId: number,
): Promise<CircleMemberProfileRecord | null> {
  const member = await db
    .selectFrom("circleMembers")
    .innerJoin("profiles", "profiles.userId", "circleMembers.userId")
    .leftJoin("genders", "genders.genderId", "profiles.genderId")
    .select([
      "circleMembers.userId",
      "profiles.displayName",
      "profiles.dateOfBirth",
      "profiles.bio",
      "profiles.datingGoal",
      "genders.genderName as gender",
      memberPhotoUrl,
    ])
    .where("circleMembers.cycleId", "=", cycleId)
    .where("circleMembers.userId", "=", memberUserId)
    .where("circleMembers.leftAt", "is", null)
    .executeTakeFirst();

  return member ?? null;
}

/**
 * Finds the group-chat conversation attached to a Circle cycle.
 *
 * @param cycleId - Weekly Circle cycle whose conversation is requested.
 * @returns The conversation ID, or null before a conversation exists.
 */
async function findCircleConversation(cycleId: number): Promise<number | null> {
  const conversation = await db
    .selectFrom("conversations")
    .select("conversationId")
    .where("type", "=", "circle")
    .where("cycleId", "=", cycleId)
    .executeTakeFirst();

  return conversation?.conversationId ?? null;
}

/**
 * Creates the cycle chat when needed and synchronises its active members.
 *
 *
 * @param cycleId - Weekly Circle cycle that owns the conversation.
 * @returns The existing or newly created conversation ID.
 * @throws Error when the conversation cannot be read after the insert.
 */
async function ensureCircleConversation(cycleId: number): Promise<number> {
  return db.transaction().execute(async (transaction) => {
    await transaction
      .insertInto("conversations")
      .values({ type: "circle", cycleId })
      .onConflict((conflict) => conflict.doNothing())
      .execute();

    const conversation = await transaction
      .selectFrom("conversations")
      .select("conversationId")
      .where("type", "=", "circle")
      .where("cycleId", "=", cycleId)
      .executeTakeFirstOrThrow(
        () => new Error("Circle conversation was not available after creation"),
      );

    const members = await transaction
      .selectFrom("circleMembers")
      .select("userId")
      .where("cycleId", "=", cycleId)
      .where("leftAt", "is", null)
      .execute();

    if (members.length > 0) {
      await transaction
        .insertInto("conversationMembers")
        .values(
          members.map(({ userId }) => ({
            conversationId: conversation.conversationId,
            userId,
          })),
        )
        .onConflict((conflict) =>
          conflict.columns(["conversationId", "userId"]).doNothing(),
        )
        .execute();
    }

    return conversation.conversationId;
  });
}

/**
 * Retrieves one cursor-based page of non-deleted conversation messages.
 *
 * Results are returned newest first for efficient database pagination. The
 * service reverses them before sending them to the client.
 *
 * @param conversationId - Conversation whose messages are requested.
 * @param before - Optional exclusive upper message-ID cursor.
 * @param limit - Maximum number of rows to return.
 * @returns The requested message rows in descending message-ID order.
 */
async function findMessages(
  conversationId: number,
  before: string | undefined,
  limit: number,
): Promise<CircleMessage[]> {
  let query = db
    .selectFrom("messages")
    .leftJoin("profiles", "profiles.userId", "messages.userId")
    .select([
      "messages.messageId",
      "messages.userId",
      "profiles.displayName",
      "messages.messageType",
      "messages.body",
      "messages.createdAt",
    ])
    .where("messages.conversationId", "=", conversationId)
    .where("messages.deletedAt", "is", null);

  if (before !== undefined) {
    query = query.where("messages.messageId", "<", before);
  }

  return query
    .orderBy("messages.messageId", "desc")
    .limit(limit)
    .execute();
}

/**
 * Inserts a text message and updates the conversation timestamp atomically.
 *
 * @param conversationId - Conversation receiving the message.
 * @param userId - Internal ID of the sender.
 * @param body - Validated and trimmed message text.
 * @returns The created message with the sender's display name.
 * @throws Error when the inserted message cannot be returned.
 */
async function insertTextMessage(
  conversationId: number,
  userId: number,
  body: string,
): Promise<CircleMessage> {
  return db.transaction().execute(async (transaction) => {
    const message = await transaction
      .insertInto("messages")
      .values({ conversationId, userId, messageType: "text", body })
      .returning([
        "messageId",
        "userId",
        "messageType",
        "body",
        "createdAt",
      ])
      .executeTakeFirstOrThrow(
        () => new Error("Message was not available after creation"),
      );

    await transaction
      .updateTable("conversations")
      .set({
        lastMessageAt: message.createdAt,
        updatedAt: message.createdAt,
      })
      .where("conversationId", "=", conversationId)
      .execute();

    const sender = await transaction
      .selectFrom("profiles")
      .select("displayName")
      .where("userId", "=", userId)
      .executeTakeFirst();

    return {
      ...message,
      displayName: sender?.displayName ?? null,
    };
  });
}

/**
 * Checks that a message belongs to the expected conversation.
 *
 * @param conversationId - Conversation that should contain the message.
 * @param messageId - PostgreSQL bigint message ID represented as a string.
 * @returns True when the message belongs to the conversation.
 */
async function messageBelongsToConversation(
  conversationId: number,
  messageId: string,
): Promise<boolean> {
  const message = await db
    .selectFrom("messages")
    .select("messageId")
    .where("conversationId", "=", conversationId)
    .where("messageId", "=", messageId)
    .executeTakeFirst();

  return message !== undefined;
}

/**
 * Advances a member's read marker without allowing it to move backwards.
 *
 * @param conversationId - Conversation whose read state is being updated.
 * @param userId - Internal ID of the member reading the conversation.
 * @param messageId - Latest message the member has read.
 * @returns Nothing after the update attempt completes.
 */
async function updateLastReadMessage(
  conversationId: number,
  userId: number,
  messageId: string,
): Promise<void> {
  await db
    .updateTable("conversationMembers")
    .set({ lastReadMessageId: messageId })
    .where("conversationId", "=", conversationId)
    .where("userId", "=", userId)
    .where((expression) =>
      expression.or([
        expression("lastReadMessageId", "is", null),
        expression("lastReadMessageId", "<", messageId),
      ]),
    )
    .execute();
}

/** Database operations used by the Circles service. */
export const circlesRepo = {
  findCurrentByUserId,
  findActiveCycleForMember,
  findMembers,
  findMemberProfile,
  findCircleConversation,
  ensureCircleConversation,
  findMessages,
  insertTextMessage,
  messageBelongsToConversation,
  updateLastReadMessage,
};
