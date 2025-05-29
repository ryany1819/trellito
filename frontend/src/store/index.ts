import { configureStore } from '@reduxjs/toolkit';
import boardReducer from '../slices/boardSlice';
import { trellitoApi } from '@/api/trellitoApi';

export const store = configureStore({
    reducer: {
        board: boardReducer,
        [trellitoApi.reducerPath]: trellitoApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(trellitoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;