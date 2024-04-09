import { ADD_RECITATION, EVALUATE_RECITATION } from "../actions/recitation"
import { ADD_BLOCK, ADD_USER , EDIT_PASSWORD, EDIT_PIC, RECEIVE_USERS, REMOVE_BLOCK } from "../actions/user"

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
        case ADD_BLOCK:
            return {
                ...state,
                [action.authed]: {
                    ...state[action.authed],
                    blockList: state[action.authed].blockList.concat([action.id])
                }
            }
        case REMOVE_BLOCK:
            return {
                ...state,
                [action.authed]: {
                    ...state[action.authed],
                    blockList: state[action.authed].blockList.filter((i) => i !== action.id)
                }
            }
        case EVALUATE_RECITATION:
            return {
                ...state,
                [action.authed]: {
                    ...state[action.authed],
                    evaluatedRecitations: state[action.authed].evaluatedRecitations.concat([action.id])
                }
            }
        default: 
            return state
    }
} 