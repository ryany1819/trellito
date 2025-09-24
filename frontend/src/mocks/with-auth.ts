import { HttpResponse } from "msw";
import { mockDecode } from "./mock-jwt";
import { mockUsers } from "./mock-repo";

const getUserIdFromAuth = (request: Request): string | null => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const { sub: accountId } = mockDecode(token) as { sub?: string };
    if (!accountId) return null;
    const userId = mockUsers.find((u) => u.accountId === accountId)?.id;
    if (!userId) return null;
    return userId;
  }
  catch {
    return null;
  }
}
export const withAuth = (handler: (userId: string, ...args: any[]) => any) => {
  return (...args: any[]) => {
    const request = args.find((arg) => arg && typeof arg === 'object' && 'headers' in arg);
    if (!request) {
      return HttpResponse.json({ error: "Internal error" }, { status: 500 });
    }
    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(userId, ...args);
  }
}