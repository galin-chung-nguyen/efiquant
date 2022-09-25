import { combineReducers } from 'redux';
import { removeToastNotification } from '../actions/actions';
import { SET_USER, SET_JWT_TOKEN, ADD_TOAST_NOTIFICATION, REMOVE_TOAST_NOTIFICATION } from '../actions/const';
import { store } from '../reduxStore';

let setUserInfoReducer = (state = null, action: any) => {
    switch (action.type) {
        case SET_USER:
            return action.payload.newUserInfo;

        default: return state;
    }
}

let setJwtTokenReducer = (state = null, action: any) => {
    switch (action.type) {
        case SET_JWT_TOKEN:
            return action.payload.newJwtToken;

        default: return state;
    }
}

let ToastNotificationReducer = (state: { message: string, type: "success" | "failed" | "warning", id: string }[] = [], action: { type: string, payload: any }): { message: string, type: "success" | "failed" | "warning", id: string }[] => {
    switch (action.type) {
        case ADD_TOAST_NOTIFICATION:
            {
                let newState: { message: string, type: "success" | "failed" | "warning", id: string }[] = [...state];
                let newToastId: string = Math.random().toString() + (new Date()).getSeconds().toString();

                if(action.payload.hasOwnProperty("newToastNotification")){
                    newState.push({ ...action.payload.newToastNotification, id: newToastId });
                }

                setTimeout(() => {
                    store.dispatch(removeToastNotification(newToastId));
                }, 7000);

                return newState;
            }

        case REMOVE_TOAST_NOTIFICATION:
            {
                if(state.find(noti => noti.id === action.payload.toastNotificationId)){
                    let newState: { message: string, type: "success" | "failed" | "warning", id: string }[] = [...state];
                    return newState.filter(newState => newState.id !== action.payload.toastNotificationId);
                }
                return state;
            }


        default: return state;
    }

}

let rootReducer = combineReducers({
    user: setUserInfoReducer,
    jwtToken: setJwtTokenReducer,
    toastNotifications: ToastNotificationReducer
});

export default rootReducer;