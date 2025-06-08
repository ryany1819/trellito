import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Board } from "@/models/board";
import { BACKEND_URL as baseUrl } from "@/config";
import type { BoardDto } from "@/dto/board";

console.log("Using base URL:", baseUrl);

function mapBoardToApi(board: Board): Partial<BoardDto> {
  return {
    ...board,
    columns: Object.values(board.columns),
    cards: Object.values(board.cards),
  };
}

function mapBoardFromApi(board: BoardDto): Board {
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
      transformResponse: (response: { boards: BoardDto[] }): Board[] =>
        response.boards?.map(mapBoardFromApi),
    }),
    getBoardById: builder.query<Board, string>({
      query: (id) => "/boards/" + id,
      transformResponse: (response: { board: BoardDto }): Board =>
        mapBoardFromApi(response.board),
    }),
    addBoard: builder.mutation<Board, Partial<Board>>({
      query: (newBoard) => ({
        url: "/boards",
        method: "POST",
        body: mapBoardToApi(newBoard as Board),
      }),
      transformResponse: (response: { board: BoardDto }): Board => {
        return mapBoardFromApi(response.board);
      },
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: "DELETE",
      }),
    }),
    updateBoard: builder.mutation<Board, Partial<Board> & { id: string }>({
      query: (updateBoard) => ({
        url: `/boards/${updateBoard.id}`,
        method: "PUT",
        body: updateBoard,
      }),
      transformResponse: (response: { board: BoardDto }): Board => {
        return mapBoardFromApi(response.board);
      },
    }),
  }),
});
