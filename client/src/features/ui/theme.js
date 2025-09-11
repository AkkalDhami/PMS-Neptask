import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    mode: localStorage.getItem("theme") || "light",
    sidebarCollapsed: false,
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.mode = action.payload
        },
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light"
            localStorage.setItem("theme", state.mode)
        },
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed
        },
        setSidebarCollapsed: (state, action) => {
            state.sidebarCollapsed = action.payload
        },
    },
})

export const { setTheme, toggleTheme, toggleSidebar, setSidebarCollapsed } = themeSlice.actions
export default themeSlice.reducer