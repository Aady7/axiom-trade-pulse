import {configureStore} from "@reduxjs/toolkit";
import { tokenTableReducer } from "@/feature/token/state/tokenTableSlice";
export const makeStore=()=>{
    return configureStore({
        reducer: {
            tokenTable: tokenTableReducer,
        },
    });
}
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;