import { createSlice } from '@reduxjs/toolkit'

const currentDate = () => {
    const today = new Date();
    const day = today.getDate(); // Lấy ngày
    const month = today.getMonth() + 1; // Lấy tháng (0-11), cần +1 để đúng tháng thực tế
    const year = today.getFullYear(); // Lấy năm

    // Định dạng ngày tháng năm theo kiểu yyyy-mm-dd
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return formattedDate;
}

export const DateRedux = createSlice({
    name: 'dateRedux',
    initialState: {
        fromDay: currentDate(),
        toDay: currentDate(),
    },
    reducers: {
        setDate: (state, action) => {
            state.fromDay = action.payload.fromDay
            state.toDay = action.payload.toDay
        },
    },
})

// Action creators are generated for each case reducer function
export const { setDate } = DateRedux.actions

export default DateRedux.reducer