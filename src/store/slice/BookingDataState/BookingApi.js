export const loadBookingFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('bookingData');
        if (!serializedState) {
            return {
                selectedSubservice: null,
                professional: null,
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading from localStorage:', err);
        return {
            selectedSubservice: null,
            professional: null,
        };
    }
};


export const saveBookingToLocalStorage = (state) => {
    try {
        localStorage.setItem('bookingData', JSON.stringify(state));
    } catch (err) {
        console.error('Error saving to localStorage:', err);
    }
};

export const clearBookingFromLocalStorage = () => {
    try {
        localStorage.removeItem('bookingData');
    } catch (err) {
        console.error('Error clearing localStorage:', err);
    }
};

export const updateBookingInLocalStorage = (newData) => {
    try {
        const oldData = loadBookingFromLocalStorage();

        const updatedData = {
            ...oldData,
            ...newData,
        };

        localStorage.setItem('bookingData', JSON.stringify(updatedData));
    } catch (err) {
        console.error("Error updating booking in localStorage:", err);
    }
};

