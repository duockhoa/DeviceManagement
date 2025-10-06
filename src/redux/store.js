import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import sidebarSlice from './slice/sibarSlice';
import searchReducer from './slice/searchSlice';
import usersReducer from './slice/usersSlice';
import assetsReducer from './slice/assetsSlice';
import departmentsReducer from './slice/departmentSlice';
import assetCategoriesReducer from './slice/assetCategoriesSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        sidebar: sidebarSlice,
        search: searchReducer,
        assets: assetsReducer,
        users: usersReducer,
        departments: departmentsReducer,
        assetCategories: assetCategoriesReducer,
    },
});
