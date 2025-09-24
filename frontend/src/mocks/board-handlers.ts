import { http, HttpResponse } from "msw";
import { BACKEND_URL } from "@/config";
import { v4 as uuidv4 } from "uuid";
import type { BoardDto } from "@/dto/board";
import { mockDecode } from "./mock-jwt";
import { mockUsers } from "./user-handlers";

const mockBoards: BoardDto[] = [
	{
		id: "board-1",
		title: "Project Alpha",
		description: "Main project for client deliverables",
		ownerId: "user-1",
		memberIds: ["user-1", "user-3"],
		columns: [
			{ id: "col-1", title: "To Do", cardIds: ["card-1", "card-2"] },
			{ id: "col-2", title: "In Progress", cardIds: ["card-3"] },
		],
		cards: [
			{ id: "card-1", title: "Setup project", description: "Initialize repo" },
			{
				id: "card-2",
				title: "Design UI",
				description: "Wireframes",
				assigneeId: "user-1",
			},
			{
				id: "card-3",
				title: "Implement auth",
				description: "Login/registration",
			},
		],
		isArchived: false,
		createdAt: new Date("2024-01-01T10:00:00Z"),
		updatedAt: new Date("2024-01-05T14:30:00Z"),
	},
	{
		id: "board-2",
		title: "Personal Tasks",
		description: "My personal productivity board",
		ownerId: "user-3",
		memberIds: ["user-3"],
		columns: [{ id: "col-3", title: "Backlog", cardIds: ["card-4"] }],
		cards: [
			{ id: "card-4", title: "Read a book", description: "Finish React book" },
		],
		isArchived: false,
		createdAt: new Date("2024-01-02T09:00:00Z"),
		updatedAt: new Date("2024-01-02T09:00:00Z"),
	},
];

const getUserIdFromAuth = (request: Request): string | null => {
	const authHeader = request.headers.get("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
	const token = authHeader.substring(7);
	try {
		const { sub: accountId } = mockDecode(token) as { sub?: string };
		if (!accountId) return null;
		const user = mockUsers.find((u) => u.accountId === accountId);
		if (!user) return null;
		return user.id;
	} catch {
		return null;
	}
};

const withAuth = (handler: (userId: string, ...args: any[]) => any) => {
	return (...args: any[]) => {
		const request = args.find(
			(arg) => arg && typeof arg === "object" && "headers" in arg
		);
		if (!request) {
			return HttpResponse.json({ error: "Internal error" }, { status: 500 });
		}
		const userId = getUserIdFromAuth(request);
		if (!userId) {
			return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return handler(userId, ...args);
	};
};

export const boardHandlers = [
	http.get(
		`${BACKEND_URL}/boards`,
		withAuth((userId) => {
			const userBoards = mockBoards.filter(
				(b) => b.ownerId === userId || b.memberIds?.includes(userId)
			);
			return HttpResponse.json({ boards: userBoards });
		})
	),
	http.get(
		`${BACKEND_URL}/boards/:id`,
		withAuth((userId, { params }) => {
			const { id } = params;
			const userBoard = mockBoards.find((b) => b.id === id);
			if (!userBoard) {
				return HttpResponse.json({ error: "Board not found" }, { status: 404 });
			}
			if (
				userBoard.ownerId !== userId &&
				!userBoard.memberIds?.includes(userId)
			) {
				return HttpResponse.json({ error: "Forbidden" }, { status: 403 });
			}
			return HttpResponse.json({ board: userBoard });
		})
	),
	http.post(
		`${BACKEND_URL}/boards`,
		withAuth(async (userId, { request }) => {
			const { title } = (await request.json()) as { title: string };
			if (!title || typeof title !== "string") {
				return HttpResponse.json({ error: "Invalid title" }, { status: 400 });
			}
			const newBoard: BoardDto = {
				id: uuidv4(),
				title,
				ownerId: userId,
				memberIds: [userId],
				columns: [],
				cards: [],
        createdAt: new Date(),
			};
			mockBoards.push(newBoard);
			return HttpResponse.json({ board: newBoard }, { status: 201 });
		})
	),
	http.delete(
		`${BACKEND_URL}/boards/:id`,
		withAuth((userId, { params }) => {
			const { id } = params;
			const index = mockBoards.findIndex((b) => b.id === id);
			if (index == -1) {
				return HttpResponse.json({ error: "Board not found" }, { status: 404 });
			}
			if (mockBoards[index].ownerId !== userId) {
				return HttpResponse.json({ error: "Forbidden" }, { status: 403 });
			}
			mockBoards.splice(index, 1);
			return HttpResponse.json({ success: true });
		})
	),
	http.put(
		`${BACKEND_URL}/boards/:id`,
		withAuth(async (userId, { params, request }) => {
			const { id } = params;
			const index = mockBoards.findIndex((b) => b.id === id);
			if (index === -1) {
				return HttpResponse.json({ error: "Board not found" }, { status: 404 });
			}
			if (
				mockBoards[index].ownerId !== userId &&
				!mockBoards[index].memberIds?.includes(userId)
			) {
				return HttpResponse.json({ error: "Forbidden" }, { status: 403 });
			}
			const updatedBoard = (await request.json()) as Partial<BoardDto>;
			if (!updatedBoard || !updatedBoard.id || !updatedBoard.title) {
				return HttpResponse.json(
					{ error: "Invalid board data" },
					{ status: 400 }
				);
			}
			mockBoards[index] = {
				...mockBoards[index],
				...updatedBoard,
				ownerId: mockBoards[index].ownerId, // Prevent changing owner
				memberIds: mockBoards[index].memberIds, // Prevent changing members here
			};
			return HttpResponse.json({ board: mockBoards[index] });
		})
	),
];
