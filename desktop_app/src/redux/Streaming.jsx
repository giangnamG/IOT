import { createSlice } from '@reduxjs/toolkit'

export const Streaming = createSlice({
    name: 'streaming',
    initialState: {
        dataStream: {}
    },
    reducers: {
        addDataStream: (state, action) => {
            // state.dataStream = [...state.dataStream, action.payload]
            state.dataStream = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { addDataStream } = Streaming.actions

export default Streaming.reducer