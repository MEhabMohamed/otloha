export const SET_AUTHED_USER = 'SET_AUTHED_USER';
export const SIGN_OUT = 'SIGN_OUT';

export function setAuthedUser (id) {
    if (typeof window !== 'undefined' && window.sessionStorage && id) {
        window.sessionStorage.setItem("authedUser", JSON.stringify([id, Date.now()]));
    }
    return {
        type: SET_AUTHED_USER,
        id,
        date: Date.now()
    };
}

export function signOut () {
    if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem("authedUser");
    }
    return {
        type: SIGN_OUT,
    };
}