import { z } from "zod";
import { insertSessionSchema, sessions } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  sessions: {
    list: {
      method: "GET" as const,
      path: "/api/sessions" as const,
      responses: {
        200: z.array(z.custom<typeof sessions.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/sessions/:id" as const,
      responses: {
        200: z.custom<typeof sessions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/sessions" as const,
      input: insertSessionSchema,
      responses: {
        201: z.custom<typeof sessions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type SessionInput = z.infer<typeof api.sessions.create.input>;
export type SessionResponse = z.infer<
  typeof api.sessions.create.responses[201]
>;
export type SessionsListResponse = z.infer<
  typeof api.sessions.list.responses[200]
>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type InternalError = z.infer<typeof errorSchemas.internal>;
