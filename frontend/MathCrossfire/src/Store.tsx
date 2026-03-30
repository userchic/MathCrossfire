import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'authentication',
    initialState: {
        isAuthenticated: localStorage.getItem("authFlag") === null ? false : localStorage.getItem("authFlag"),
        login: localStorage.getItem("login") === null ? "" : localStorage.getItem("login")
    },
    reducers: {
        signIn: (state, login) => {
            state.isAuthenticated = true;
            state.login = login.payload
        },
        signOut: (state) => {
            state.isAuthenticated = false;
            state.login = ""
        },
    },
});

// Экшены
export const { signIn, signOut } = authSlice.actions;

// Store
export const store = configureStore({
    reducer: {
        Auth: authSlice.reducer,
    },
});