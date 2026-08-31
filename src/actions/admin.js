import { deleteAdmins, saveAdmins } from "../helpers/savers"

export const ADD_ADMIN = 'ADD_ADMIN'
export const RECEIVE_ADMINS = 'RECEIVE_ADMINS'
export const DELETE_ADMIN = 'DELETE_ADMIN'

function addAdmin (admin) {
    return {
        type: ADD_ADMIN,
        admin,
    }
}

export function handleAddAdmin (email) {
    return (dispatch) => {
        return saveAdmins({
            email
        })
        .then((em) => dispatch(addAdmin(em)))
    }
}

export function receiveAdmins(admins) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem("admins", JSON.stringify(admins));
    }
    return {
        type: RECEIVE_ADMINS,
        admins
    }
}

function deleteAdmin(id) {
    return {
        type: DELETE_ADMIN,
        id,
    }
}

export function handleDeleteAdmin(id) {
    return (dispatch) => {
        return deleteAdmins({
            id
        }).then(() => dispatch(deleteAdmin(id)))
    }
}