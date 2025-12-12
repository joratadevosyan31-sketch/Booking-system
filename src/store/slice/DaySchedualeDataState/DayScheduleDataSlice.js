import { createSlice } from "@reduxjs/toolkit";
import { fetchGetDayScheduleData } from "./DaySchedulDataApi";

const DayScheduleDataSlice = createSlice({
    name: "dayScheduleData",
    initialState: {
        isLoading: false,
        dayScheduleData: [],
        isError: false,
    },

    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchGetDayScheduleData.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchGetDayScheduleData.fulfilled, (state, { payload }) => {
                state.isLoading = false
                state.dayScheduleData = payload.schedules
            }).addCase(fetchGetDayScheduleData.rejected, (state, { payload }) => {
                state.isLoading = false
                state.isError = payload
            })
    }
})

export const dayScheduleDataReducer = DayScheduleDataSlice.reducer