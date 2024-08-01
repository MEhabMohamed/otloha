import { ADD_RECITATION, ADD_RECITATION_RATING, EVALUATE_RECITATION } from "../actions/recitation"
import { ADD_BLOCK, ADD_USER_RATING, ADD_USER , EDIT_PASSWORD, EDIT_PIC, RECEIVE_USERS, REMOVE_BLOCK, ADD_TEACHER_EVALUATION } from "../actions/user"

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
        case ADD_USER_RATING:
            return {
                ...state,
                [action.ratedId]: {
                    ...state[action.ratedId],
                    raters: state[action.ratedId].raters.concat([{rater: action.raterId, rating: action.rating}]),
                },
                [action.raterId]: {
                    ...state[action.raterId],
                    rated: state[action.raterId].rated.concat([action.ratedId])
                }
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
                    recitations: state[action.authed].recitations
                    .concat([action.recitation.id])
                }
            }
        case ADD_BLOCK:
            return {
                ...state,
                [action.authed]: {
                    ...state[action.authed],
                    blockList: state[action.authed].blockList.concat([action.id])
                },
                [action.id]: {
                    ...state[action.id],
                    active: false
                }
            }
        case REMOVE_BLOCK:
            return {
                ...state,
                [action.authed]: {
                    ...state[action.authed],
                    blockList: state[action.authed].blockList
                    .filter((i) => i !== action.id)
                },
                [action.id]: {
                    ...state[action.id],
                    active: true
                }
            }
        case EVALUATE_RECITATION:
            return {
                ...state,
                [action.authed]: {
                    ...state[action.authed],
                    evaluatedRecitations: state[action.authed].evaluatedRecitations
                    .concat([action.id])
                }
            }
        case ADD_TEACHER_EVALUATION:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    status: action.status
                }
            }
        case ADD_RECITATION_RATING:
            return {
                ...state,
                [action.raterId]: {
                    ...state[action.raterId],
                    ratedRecitations: state[action.raterId].ratedRecitations
                    .concat([action.ratedId])
                }
            }
        default: 
            return state
    }
} 