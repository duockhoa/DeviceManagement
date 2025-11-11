import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        activeCollapse: ["deviceManagement" , "maintenance" , "calibration"],
        isOpen: true,
    },
    reducers: {
        setActiveCollapse: (state, action) => {
            const item = action.payload;
            if (state.activeCollapse.includes(item)) {
                state.activeCollapse = state.activeCollapse.filter((i) => i !== item);
            } else {
                state.activeCollapse.push(item);
            }
        },
        clearActiveCollapse: (state) => {
            state.activeCollapse = [];
        },
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        },
        setActiveSideBar: (state, action) => {
            state.activeSidebar = action.payload;
        },
    },
});

export const { setActiveCollapse, setActiveSideBar, setIsOpen, clearActiveCollapse } = sidebarSlice.actions;
export default sidebarSlice.reducer;
