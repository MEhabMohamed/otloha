import { saveAdmins } from "../helpers/savers"

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
    return {
        type: RECEIVE_ADMINS,
        admins
    }
}

export function deleteAdmin( id , admins) {
    return {
        type: DELETE_ADMIN,
        id,
        admins
    }
}