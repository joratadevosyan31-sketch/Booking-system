import { useEffect } from "react"
import CalendarBox from "./Components/CalendarBox"
import ChangeProfessional from "./Components/ChangeProfessional"
import { useDispatch, useSelector } from "react-redux"
import { fetchGetDayScheduleData } from "../../../../store/slice/DaySchedualeDataState/DaySchedulDataApi"


const TimeSlots = () => {

    const dispatch = useDispatch()

    const { bookingData } = useSelector(state => state.bookingData)
    const { dayScheduleData } = useSelector((state) => state.dayScheduleData)

    useEffect(() => {
        if (!bookingData || bookingData.length === 0) {
            dispatch(fetchGetDayScheduleData())
        }
    }, [dispatch])

    console.log(dayScheduleData);

    return (
        <div>
            <div className="flex flex-col gap-5">
                <div>
                    <h2 className='text-[48px] font-bold'>Select Time</h2>
                </div>
                <div className="flex flex-col items-start  gap-8">
                    <ChangeProfessional />
                    <div className="flex items-start gap-6 ">
                        <div className='w-3/6'>
                            <CalendarBox />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 ">
                            <button
                                type="button"
                                className="text-[14px] font-semibold p-3 border-[2px] border-gray rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                10:00
                            </button>
                            <button
                                type="button"
                                className="text-[14px] font-semibold p-3 border-[2px] border-gray rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                10:15
                            </button>
                            <button
                                type="button"
                                className="text-[14px] font-semibold p-3 border-[2px] border-gray rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                10:30
                            </button>
                            <button
                                type="button"
                                className="text-[14px] font-semibold p-3 border-[2px] border-gray rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                10:45
                            </button>
                            <button
                                type="button"
                                className="text-[14px] font-semibold p-3 border-[2px] border-gray rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                11:00
                            </button>
                            <button
                                type="button"
                                className="text-[14px] font-semibold p-3 border-[2px] border-gray rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                11:15
                            </button>
                            <button
                                type="button"
                                className="text-[14px] font-semibold p-3 border-[2px] border-gray rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                11:30
                            </button>
                        </div>
                    </div>
                    {/* <button
                        type='button'
                        className='p-1 rounded-full'
                    >
                        <svg className='size-7' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z" /></svg>
                    </button> */}
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default TimeSlots