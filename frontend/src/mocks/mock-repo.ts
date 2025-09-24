import type { BoardDto } from "@/dto/board";
import type { UserDto } from "@/dto/user";

// Mock data for boards
export const mockBoards: BoardDto[] = [
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

// Mock data for users
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

export const repo = {
  boards: mockBoards,
  users: mockUsers,
}