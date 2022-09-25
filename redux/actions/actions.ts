import { SET_USER, SET_JWT_TOKEN, ADD_TOAST_NOTIFICATION, REMOVE_TOAST_NOTIFICATION } from './const';

export const setUserInfoAction = (newUserInfo = null) => {
    return {
        type : SET_USER,
        payload : {
            newUserInfo : newUserInfo
        }
    }
}

export const setJwtTokenAction = (newJwtToken: string|null = null) => {
    return {
        type : SET_JWT_TOKEN,
        payload : {
            newJwtToken: newJwtToken
        }
    }
}

export const addToastNotification = (newToastNotification: {message: string, type: "success" | "failed" | "warning"}) => {
    return {
        type : ADD_TOAST_NOTIFICATION,
        payload : {
            newToastNotification: newToastNotification
        }
    }
}

export const removeToastNotification = (toastNotificationId: string) => {
    return {
        type : REMOVE_TOAST_NOTIFICATION,
        payload : {
            toastNotificationId: toastNotificationId
        }
    }
}