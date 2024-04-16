import { ADD_ADMIN, DELETE_ADMIN, RECEIVE_ADMINS } from "../actions/admin"

export default function admins (state={}, action) {
    switch (action.type) {
        case ADD_ADMIN:
            return {
                ...state,
                [action.admin.id]: action.admin,
            }
        case RECEIVE_ADMINS:
            return {
                ...state,
                ...action.admins,
            }
        case DELETE_ADMIN:
            return Object
            .fromEntries(Object.entries(state).filter(e => e[0] !== action.id))
        default: 
            return state
    }
}