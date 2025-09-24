import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store"; // Adjust the import path to where your RootState is defined
import type { Board } from "@/models/board";
import { BACKEND_URL as baseUrl } from "@/config";
import type { BoardDto } from "@/dto/board";
import type { UserDto } from "@/dto/user";
import type { User } from "@/models/user";

console.log("Using base URL:", baseUrl);

function mapBoardToDto(board: Board): Partial<BoardDto> {
  return {
    ...board,
    columns: Object.values(board.columns),
    cards: Object.values(board.cards),
  };
}

function mapBoardFromDto(dto: BoardDto): Board {
  return {
    ...dto,
    owner: { id: dto.ownerId } as User,
    members: (dto.memberIds || []).map((id) => ({id} as User)),
    columns: Object.fromEntries(dto.columns.map((col) => [col.id, col])),
    cards: Object.fromEntries(dto.cards.map((card) => [card.id, card])),
  };
}

function mapUserFromDto(dto: UserDto): User {
  return {
    ...dto,
  };
}

export const trellitoApi = createApi({
  reducerPath: "trellitoApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).auth.accessToken;
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBoards: builder.query<Board[], void>({
      query: () => "/boards",
      transformResponse: (response: { boards: BoardDto[] }): Board[] =>
        response.boards?.map(mapBoardFromDto),
    }),
    getBoardById: builder.query<Board, string>({
      query: (id) => "/boards/" + id,
      transformResponse: (response: { board: BoardDto }): Board =>
        mapBoardFromDto(response.board),
    }),
    addBoard: builder.mutation<Board, Partial<Board>>({
      query: (newBoard) => ({
        url: "/boards",
        method: "POST",
        body: mapBoardToDto(newBoard as Board),
      }),
      transformResponse: (response: { board: BoardDto }): Board => {
        return mapBoardFromDto(response.board);
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
        return mapBoardFromDto(response.board);
      },
    }),
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      transformResponse: (response: {user: UserDto}): User => (mapUserFromDto(response.user)),
    }),
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {user: UserDto}): User => (mapUserFromDto(response.user)),
    }),
  }),
});

