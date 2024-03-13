import { createStore } from "redux";
import { combineReducer } from "./combinedReducer";

export const store = createStore(
    combineReducer
)