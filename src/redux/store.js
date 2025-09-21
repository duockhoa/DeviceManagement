import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import sidebarSlice from './slice/sibarSlice';
import searchReducer from './slice/searchSlice';
import usersReducer from './slice/usersSlice';
import commentReducer from './slice/commentSlice';
export default configureStore({
    reducer: {
        user: userReducer,
        sidebar: sidebarSlice,
        search: searchReducer,
        users: usersReducer,
        comment: commentReducer,
    },
});
