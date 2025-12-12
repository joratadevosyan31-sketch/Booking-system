import { createSlice } from "@reduxjs/toolkit";
import firebase from "firebase/compat/app";

const AuthDataSlice = createSlice({
    name: "authData",
    initialState: {
        user: null,
        firebaseUser: null,
        token: null,
        phoneNumber: "",
        isLoading: false,
        isError: false,
    },
    reducers: {

    },

})

export const authDataReducer = AuthDataSlice.reducer