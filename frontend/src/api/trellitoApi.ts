import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Board } from "@/models/board";
import { BACKEND_URL as baseUrl } from "@/config";

console.log("Using base URL:", baseUrl);
type BoardResponse = {
  id: string;
  title: string;
  columns: { id: string; title: string; cardIds: string[] }[];
  cards: {
    id: string;
    title: string;
    description?: string;
    assigneeId?: string;
  }[];
};

function mapBoardFromApi(board: BoardResponse): Board {
  return {
    ...board,
    columns: Object.fromEntries(board.columns.map((col) => [col.id, col])),
    cards: Object.fromEntries(board.cards.map((card) => [card.id, card])),
  };
}

export const trellitoApi = createApi({
  reducerPath: "trellitoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getBoards: builder.query<Board[], void>({
      query: () => "/boards",
      transformResponse: (response: { boards: BoardResponse[] }): Board[] =>
        response.boards?.map(mapBoardFromApi),
    }),
    getBoardById: builder.query<Board, string>({
      query: (id) => "/boards/" + id,
      transformResponse: (response: { board: BoardResponse }): Board =>
        mapBoardFromApi(response.board),
    }),
  }),
});
