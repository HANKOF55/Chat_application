import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice.js';
import socketReducer from "./features/socketSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        socket: socketReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['socket/setSocket'],
                ignoredPaths: ['socket.socket'],
            },
        }),
})

