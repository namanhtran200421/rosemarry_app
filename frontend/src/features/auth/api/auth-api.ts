import { environment } from "../../../shared/config/environment";

export interface ApplicationSession {
  userId: number;
  role: "USER" | "STAFF";
  profileExists: boolean;
}

export class ApplicationSessionError extends Error {
  constructor(readonly status: number) {
    super("The application session could not be created.");
    this.name = "ApplicationSessionError";
  }
}

export async function createApplicationSession(
  accessToken: string,
): Promise<ApplicationSession> {
  const response = await fetch(`${environment.apiUrl}/api/v1/auth/session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new ApplicationSessionError(response.status);
  }

  return response.json() as Promise<ApplicationSession>;
}
