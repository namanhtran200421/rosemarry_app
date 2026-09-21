import { circlesRepo } from "./circles.repository.js";
import type { CurrentCirclesResponse } from "./circles.types.js";

export async function listCurrentCircles(
  userId: number,
): Promise<CurrentCirclesResponse> {
  const circles = await circlesRepo.findCurrentByUserId(
    userId,
    new Date(),
  );

  return { circles };
}