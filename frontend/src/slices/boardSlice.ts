import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// import type { Board } from '@/models/board';

type BoardState = {
    selectedBoardId: string | null;
};

const initialState: BoardState = {
    selectedBoardId: null,
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
            const id = action.payload;
            if (state.selectedBoardId !== id) {
                state.selectedBoardId = id;
            }
        }
    }
});


export const { /*addBoard, updateBoard, deleteBoard,*/ setSelectedBoard } = boardSlice.actions;
export default boardSlice.reducer;