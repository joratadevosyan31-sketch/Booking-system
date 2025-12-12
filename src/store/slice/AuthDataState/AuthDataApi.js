import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../axiosConfig/AxiosConfig";


export const fetchGetAuthData = createAsyncThunk("authData/fetchGetAuthData", async () => {
    try {
        const response = await instance.get("/customers/one")
        const result = response.data

        return result
    } catch (error) {
        console.error("fetchGetEmployeesData error:", error);
        throw error;
    }
})