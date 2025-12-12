import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../axiosConfig/AxiosConfig";

export const fetchGetDayScheduleData = createAsyncThunk("dayScheduleData/fetchGetDayScheduleData", async () => {
    try {
        const response = await instance.get("day-schedules")
        const result = response.data

        return result
    } catch (error) {
        console.log("fetchGetDayScheduleData error:", error)
        throw error
    }
})