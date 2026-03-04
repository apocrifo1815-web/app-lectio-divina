import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed initial data
  const existing = await storage.getSessions();
  if (existing.length === 0) {
    await storage.createSession({
      passage: "Matthew 5:17-19",
      lectioNotes: "Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil.",
      meditatioNotes: "Every word of God is important and has a purpose in our lives.",
      oratioNotes: "Lord, help me to follow Your law with a sincere heart.",
      contemplatioNotes: "Resting in the perfection of God's word."
    });
  }

  app.get(api.sessions.list.path, async (req, res) => {
    const notes = await storage.getSessions();
    res.json(notes);
  });

  app.get(api.sessions.get.path, async (req, res) => {
    const session = await storage.getSession(Number(req.params.id));
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  });

  app.post(api.sessions.create.path, async (req, res) => {
    try {
      const input = api.sessions.create.input.parse(req.body);
      const session = await storage.createSession(input);
      res.status(201).json(session);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
