const LOG_IN = 'LOG_IN';
const LOG_OUT = 'LOG_OUT';


const reducer = (state, action) => {
    switch (action.type) {
        case LOG_OUT: return {...state, isAuthenticated: false, }
    }
}