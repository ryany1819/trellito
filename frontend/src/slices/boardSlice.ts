import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// import type { Board } from '@/models/board';

type BoardState = {
    selectedBoardId: string | null;
    selectedCardId: string | null;
};

const initialState: BoardState = {
    selectedBoardId: null,
    selectedCardId: null,
};

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        // addBoard: (state: BoardState, action: PayloadAction<Board>) => {
        //     const board = action.payload;
        //     state.boards[board.id] = board;
        // },
        // updateBoard: (state: BoardState, action: PayloadAction<Partial<Board> & { id: string }>) => {
        //     const { id, ...updates } = action.payload;
        //     if (state.boards[id]) {
        //         state.boards[id] = { ...state.boards[id], ...updates };
        //     }
        // },
        // deleteBoard: (state: BoardState, action: PayloadAction<string>) => {
        //     const id = action.payload;
        //     if (state.boards[id]) {
        //         delete state.boards[id];
        //         if (state.selectedBoardId === id) {
        //             state.selectedBoardId = null;
        //         }
        //     }
        // },
        setSelectedBoard: (state: BoardState, action: PayloadAction<string>) => {
            state.selectedBoardId = action.payload;
            state.selectedCardId = null; // Clear selected card when board changes
        },
        setSelectedCard: (state: BoardState, action: PayloadAction<string | null>) => {
            state.selectedCardId = action.payload;
        }
    }
});


export const { /*addBoard, updateBoard, deleteBoard,*/ setSelectedBoard } = boardSlice.actions;
export default boardSlice.reducer;