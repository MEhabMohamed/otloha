import { ADD_RECITATION } from "../actions/recitation"
import { ADD_USER , EDIT_PASSWORD, EDIT_PIC, RECEIVE_USERS } from "../actions/user"

export default function users(state={}, action) {
    switch (action.type) {
        case ADD_USER:
            return {
                ...state,
                [action.user.id]: action.user
            }
        case RECEIVE_USERS:
            return {
                ...state,
                ...action.users,
            }
        case EDIT_PASSWORD:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    password: action.password
                }
            }
        case EDIT_PIC:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    avatar: action.pic
                }
            }
        case ADD_RECITATION:
            return {
                ...state,
                [action.authed]: {
                    ...state[action.authed],
                    recitations: state[action.authed].recitations.concat([action.recitation.id])
                }
            }
        default: 
            return state
    }
} 