import { http, HttpResponse } from "msw";
import { BACKEND_URL } from "@/config";
import { mockUsers } from "./mock-repo";
import { withAuth } from "./with-auth";

export const userHandlers = [
  http.get(`${BACKEND_URL}/me`, withAuth((userId) => {
    console.log("Handling GET /me request in mock handler");
      const user = mockUsers.find((u) => u.id === userId);
      if (!user) {
        return HttpResponse.json({ error: "User not found" }, { status: 404 });
      }
      return HttpResponse.json({ user });
  })),
  http.get(`${BACKEND_URL}/users/:id`, withAuth(async (_, { params}) => {
    console.log("Handling GET /users/:id request in mock handler");
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }
    return HttpResponse.json({ user });
  })),
  http.get(`${BACKEND_URL}/users`, withAuth((_, { request }) => {
    console.log("Handling GET /users request in mock handler");
    const url = new URL(request.url);
    const ids = url.searchParams.get('ids')?.split(',').map(id => id.trim()).filter(Boolean);
    const users = ids ? mockUsers.filter((u) => ids.includes(u.id)) : mockUsers;
    return HttpResponse.json({ users });
  })),
];
