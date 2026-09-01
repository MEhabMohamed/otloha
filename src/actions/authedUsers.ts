import { setSessionUser } from "../helpers/savers";

export const SET_AUTHED_USER = 'SET_AUTHED_USER';
export const SIGN_OUT = 'SIGN_OUT';

export function receiveAuthedUser(id: string, date: number = Date.now()) {
  return {
    type: SET_AUTHED_USER,
    id,
    date
  };
}

function signOutAction() {
  return {
    type: SIGN_OUT,
  };
}

export function setAuthedUser(id: string) {
  return (dispatch: any) => {
    return setSessionUser(id).then(() => {
      dispatch(receiveAuthedUser(id));
    });
  };
}

export function signOut() {
  return (dispatch: any) => {
    return setSessionUser(null).then(() => {
      dispatch(signOutAction());
    });
  };
}
