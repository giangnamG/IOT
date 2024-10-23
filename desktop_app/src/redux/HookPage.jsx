import { createSlice } from '@reduxjs/toolkit'

export const HookPage = createSlice({
    name: 'hook',
    initialState: {
        hookName: localStorage.getItem('fragment') ? localStorage.getItem('fragment') : 'default',
        props: {}
    },
    reducers: {
        setHook: (state, action) => {
            state.hookName = action.payload.hookName
            state.props = action.payload.props
        },
    },
})

// Action creators are generated for each case reducer function
export const { setHook } = HookPage.actions

export default HookPage.reducer