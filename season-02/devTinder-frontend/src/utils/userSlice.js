import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        addUser: (state, action) => {
            return action.payload;
        },
        removeUser: (state, action) => {
            return null;
        }
    }
})

//exporting reducer functions
export const { addUser, removeUser} = userSlice.actions


// exporting reducers
export default userSlice.reducer;