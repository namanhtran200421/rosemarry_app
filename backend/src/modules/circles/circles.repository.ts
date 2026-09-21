import { db } from "../../infrastructure/database/database.js";
import type { CurrentCircle } from "./circles.types.js";

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

export const circlesRepo = {
  findCurrentByUserId,
};