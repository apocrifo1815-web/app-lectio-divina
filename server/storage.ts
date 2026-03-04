import { db } from "./db";
import {
  sessions,
  type CreateSessionRequest,
  type SessionResponse,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getSessions(): Promise<SessionResponse[]>;
  getSession(id: number): Promise<SessionResponse | undefined>;
  createSession(session: CreateSessionRequest): Promise<SessionResponse>;
}

export class DatabaseStorage implements IStorage {
  async getSessions(): Promise<SessionResponse[]> {
    return await db.select().from(sessions);
  }

  async getSession(id: number): Promise<SessionResponse | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session;
  }

  async createSession(insertSession: CreateSessionRequest): Promise<SessionResponse> {
    const [session] = await db.insert(sessions).values(insertSession).returning();
    return session;
  }
}

export const storage = new DatabaseStorage();
