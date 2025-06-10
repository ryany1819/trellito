import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
    accessToken: string | null;
};

const initialState: AuthState = {
    accessToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state: AuthState, action: PayloadAction<string | null>) => {
            const token = action.payload;
            state.accessToken = token;
        }
    }
});

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;
