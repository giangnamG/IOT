import { createSlice } from '@reduxjs/toolkit'

export const WaringCountRedux = createSlice({
    name: 'waringCountRedux',
    initialState: {
        stateWaring: []
    },
    reducers: {
        setStateWarningCount: (state, action) => {
            state.stateWaring = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setStateWarningCount } = WaringCountRedux.actions

export default WaringCountRedux.reducer