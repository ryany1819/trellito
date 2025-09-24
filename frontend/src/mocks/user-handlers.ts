import { http, HttpResponse } from "msw";
import { BACKEND_URL } from "@/config";
import type { UserDto } from "@/dto/user";
import { mockDecode } from "./mock-jwt";
import { mockAccounts } from "./auth-handlers";

export const mockUsers: UserDto[] = [
  {
    id: "1",
    accountId: "user-1",
    email: "test@example.com",
    displayName: "John Doe",
    avatarUrl: "https://example.com/avatar1.png",
    createdAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    id: "2",
    accountId: "user-2",
    email: "admin@example.com",
    displayName: "Jane Smith",
    avatarUrl: "https://i.pravatar.cc/300?img=2",
    createdAt: new Date("2023-02-01T00:00:00Z"),
  },
  {
    id: "3",
    accountId: "user-3",
    email: "guest@example.com",
    displayName: "Alice Johnson",
    avatarUrl: "https://example.com/avatar3.png",
    createdAt: new Date("2023-03-01T00:00:00Z"),
  },
];

function extractBearerToken(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
}
export const userHandlers = [
  http.get(`${BACKEND_URL}/me`, async ({ request }) => {
    console.log("Handling GET /me request in mock handler");
    const token = extractBearerToken(request);
    if (!token) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const decoded = mockDecode(token) as { sub?: string };
      if (!decoded?.sub) {
        return HttpResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      const account = mockAccounts.find((a) => a.id === decoded.sub);
      if (!account) {
        return HttpResponse.json({ error: "Account not found" }, { status: 404 });
      }
      const user = mockUsers.find((u) => u.accountId === decoded.sub);
      if (!user) {
        return HttpResponse.json({ error: "User not found" }, { status: 404 });
      }
      const userDto: UserDto = {
        id: user.id,
        accountId: user.accountId,
        email: account.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      };
      return HttpResponse.json({ user: userDto });
    } catch (error) {
      return HttpResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }),
];
