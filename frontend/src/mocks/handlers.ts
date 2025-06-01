import { http, HttpResponse } from "msw";
import { BACKEND_URL } from "@/config";
import { v4 as uuidv4 } from "uuid";
import type { BoardDto } from "@/api/trellitoApi";

const boards = [
	{
		id: "board-1",
		title: "Project Alpha",
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
	},
	{
		id: "board-2",
		title: "Personal Tasks",
		columns: [{ id: "col-3", title: "Backlog", cardIds: ["card-4"] }],
		cards: [{ id: "card-4", title: "Read a book" }],
	},
];

export const handlers = [
	http.get(`${BACKEND_URL}/boards`, () => {
		return HttpResponse.json({ boards });
	}),
	http.get(`${BACKEND_URL}/boards/:id`, ({ params }) => {
		const { id } = params;
		const board = boards.find((b) => b.id === id);
		if (board) {
			return HttpResponse.json({ board });
		}
		return HttpResponse.json({ error: "Board not found" }, { status: 404 });
	}),
	http.post(`${BACKEND_URL}/boards`, async ({ request }) => {
		const { title } = (await request.json()) as { title: string };
		if (!title || typeof title !== "string") {
			return HttpResponse.json({ error: "Invalid title" }, { status: 400 });
		}
		const newBoard: BoardDto = {
			id: uuidv4(),
			title,
			columns: [],
			cards: [],
		};
		boards.push(newBoard);
		return HttpResponse.json({ board: newBoard }, { status: 201 });
	}),
  http.delete(`${BACKEND_URL}/boards/:id`, ({params}) => {
    const { id } = params;
    const index = boards.findIndex((b) => b.id === id);
    if (index == -1) {
      return HttpResponse.json({ error: "Board not found" }, { status: 404 });
    }
    boards.splice(index, 1);
  }),
  http.put(`${BACKEND_URL}/boards/:id`, async ({ params, request }) => {
    const { id } = params;
    const index = boards.findIndex((b) => b.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    const updatedBoard = await request.json() as BoardDto;
    if (!updatedBoard || !updatedBoard.id || !updatedBoard.title) {
      return HttpResponse.json({ error: 'Invalid board data' }, { status: 400 });
    }
    boards[index] = {
      ...boards[index],
      ...updatedBoard,
      columns: updatedBoard.columns || [],
      cards: updatedBoard.cards || [],
    }
    return HttpResponse.json({ board: boards[index] });
  })
];
