import { createSlice } from '@reduxjs/toolkit'

export const ResponseCommand = createSlice({
    name: 'responseCommand',
    initialState: {
        dataResponseCommand: {}
    },
    reducers: {
        setResponseCommand: (state, action) => {
            state.dataResponseCommand = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setResponseCommand } = ResponseCommand.actions

export default ResponseCommand.reducer