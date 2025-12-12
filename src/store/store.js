import { configureStore } from "@reduxjs/toolkit";
import { servicesDateReducer } from "./slice/ServicesDataState/ServicesDataSlice";
import { employeesDataReducer } from "./slice/EmployeesDataState/EmployeeDataSlice";
import { salonDataReducer } from "./slice/SalonDataState/SalonDataSlice";
import { bookingDataReducer } from "./slice/BookingDataState/BookingDataSlice";
import { customerDataReducer } from "./slice/CustomersDataState/CustomersDataSlice";
import { authDataReducer } from "./slice/AuthDataState/AuthDataSlice";
import { dayScheduleDataReducer } from "./slice/DaySchedualeDataState/DayScheduleDataSlice";

export const store = configureStore({
    reducer: {
        salonData: salonDataReducer,
        servicesData: servicesDateReducer,
        employeesData: employeesDataReducer,
        bookingData: bookingDataReducer,
        customerData: customerDataReducer,
        authData: authDataReducer,
        dayScheduleData: dayScheduleDataReducer,
    }
})