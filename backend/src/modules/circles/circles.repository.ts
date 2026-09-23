import { sql } from "kysely";

import { db } from "../../infrastructure/database/database.js";
import type {
  CircleMemberProfileRecord,
  CircleMemberRecord,
  CircleMessage,
  CurrentCircle,
} from "./circles.types.js";
/**
 * SQL subquery. Will be reused. It essentially takes the photo URL of the member.
 * For a circle member:
 * 1. Look at their profile photo
 * 2. Use the primary profile photo if possible
 * 3. Use the lowest photo order otherwise
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
 * Get the circle details by
 * @param userId 
 * @param currentTime 
 * @returns 
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

async function findCircleConversation(cycleId: number): Promise<number | null> {
  const conversation = await db
    .selectFrom("conversations")
    .select("conversationId")
    .where("type", "=", "circle")
    .where("cycleId", "=", cycleId)
    .executeTakeFirst();

  return conversation?.conversationId ?? null;
}

/** Creates the cycle chat when needed and synchronises its active members. */
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
