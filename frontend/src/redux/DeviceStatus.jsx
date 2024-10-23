import { createSlice } from '@reduxjs/toolkit'

export const DeviceStatus = createSlice({
    name: 'deviceStatus',
    initialState: {
        dataDeviceStatus: {}
    },
    reducers: {
        setDeviceStatus: (state, action) => {
            state.dataDeviceStatus = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setDeviceStatus } = DeviceStatus.actions

export default DeviceStatus.reducer