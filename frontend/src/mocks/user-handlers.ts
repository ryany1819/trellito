import { http, HttpResponse } from "msw";
import { BACKEND_URL } from "@/config";
import type { UserDto } from "@/dto/user";
import { mockDecode } from "./mock-jwt";

const mockUsers: UserDto[] = [
  {
    id: "1",
    accountId: "acc1",
    displayName: "John Doe",
    avatarUrl: "https://example.com/avatar1.png",
    createdAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    id: "2",
    accountId: "acc2",
    displayName: "Jane Smith",
    avatarUrl: "https://example.com/avatar2.png",
    createdAt: new Date("2023-02-01T00:00:00Z"),
  },
  {
    id: "3",
    accountId: "acc3",
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
      const user = mockUsers.find((u) => u.accountId === decoded.sub);
      if (!user) {
        return HttpResponse.json({ error: "User not found" }, { status: 404 });
      }
      return HttpResponse.json(user);
    } catch (error) {
      return HttpResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }),
];
