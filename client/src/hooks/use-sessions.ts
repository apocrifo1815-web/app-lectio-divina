import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type SessionInput, type SessionResponse, type SessionsListResponse } from "@shared/routes";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useSessions() {
  return useQuery({
    queryKey: [api.sessions.list.path],
    queryFn: async () => {
      const res = await fetch(api.sessions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      return parseWithLogging<SessionsListResponse>(api.sessions.list.responses[200], data, "sessions.list");
    },
  });
}

export function useSession(id: number) {
  return useQuery({
    queryKey: [api.sessions.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.sessions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      return parseWithLogging<SessionResponse>(api.sessions.get.responses[200], data, "sessions.get");
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: SessionInput) => {
      const validated = api.sessions.create.input.parse(data);
      const res = await fetch(api.sessions.create.path, {
        method: api.sessions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Validation failed");
        }
        throw new Error("Failed to save session");
      }
      
      const responseData = await res.json();
      return parseWithLogging<SessionResponse>(api.sessions.create.responses[201], responseData, "sessions.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sessions.list.path] });
    },
  });
}
