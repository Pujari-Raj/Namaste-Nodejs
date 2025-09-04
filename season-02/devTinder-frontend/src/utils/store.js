import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../utils/userSlice'
import feedReducer from '../utils/feedSlice'
import connectionReducer from '../utils/connectionsSlice'

const store = configureStore({
    reducer: {
        user : userReducer,
        feed: feedReducer,
        connections: connectionReducer
    }
})

export default store;