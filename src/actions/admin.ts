import { deleteAdmins, saveAdmins } from "../helpers/savers";

export const ADD_ADMIN = 'ADD_ADMIN';
export const RECEIVE_ADMINS = 'RECEIVE_ADMINS';
export const DELETE_ADMIN = 'DELETE_ADMIN';

function addAdmin(admin: any) {
  return {
    type: ADD_ADMIN,
    admin,
  };
}

export function handleAddAdmin(email: string) {
  return (dispatch: any) => {
    return saveAdmins({
      email
    })
    .then((em: any) => dispatch(addAdmin(em)));
  };
}

export function receiveAdmins(admins: any) {
  return {
    type: RECEIVE_ADMINS,
    admins
  };
}

function deleteAdmin(id: string) {
  return {
    type: DELETE_ADMIN,
    id,
  };
}

export function handleDeleteAdmin(id: string) {
  return (dispatch: any) => {
    return deleteAdmins({
      id
    }).then(() => dispatch(deleteAdmin(id)));
  };
}
