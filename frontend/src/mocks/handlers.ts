import { http, HttpResponse } from 'msw';
import { BACKEND_URL } from '@/config';

const boards = [
  {
    id: "board-1",
    title: "Project Alpha",
    columns: [
      { id: "col-1", title: "To Do", cardIds: ["card-1", "card-2"] },
      { id: "col-2", title: "In Progress", cardIds: ["card-3"] }
    ],
    cards: [
      { id: "card-1", title: "Setup project", description: "Initialize repo" },
      { id: "card-2", title: "Design UI", description: "Wireframes", assigneeId: "user-1" },
      { id: "card-3", title: "Implement auth", description: "Login/registration" }
    ]
  },
  {
    id: "board-2",
    title: "Personal Tasks",
    columns: [
      { id: "col-3", title: "Backlog", cardIds: ["card-4"] }
    ],
    cards: [
      { id: "card-4", title: "Read a book" }
    ]
  }
];

export const handlers = [
    http.get(`${BACKEND_URL}/boards`, () => {
      return HttpResponse.json({ boards });
    }),
    http.get(`${BACKEND_URL}/boards/:id`, ({params}) => {
      const { id } = params;
      const board = boards.find(b => b.id === id);
      if (board) {
        return HttpResponse.json({board});
      }
      return HttpResponse.json({ error: "Board not found" }, { status: 404});
    })
]