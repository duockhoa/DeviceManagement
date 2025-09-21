import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        activeSidebar: '/',
        activeCollapse: ['Tổ chức', 'Kế Toán SX & DA'],
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

export const { setActiveCollapse, setActiveSideBar, setRequestTypeActive, setIsOpen, clearActiveCollapse } =
    sidebarSlice.actions;
export default sidebarSlice.reducer;
