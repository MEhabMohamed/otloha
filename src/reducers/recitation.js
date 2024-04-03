import { ADD_RECITATION , RECEIVE_RECITATIONS , DELETE_RECITATION } from "../actions/recitation"

export default function recitations (state=[], action) {
    switch (action.type) {
        case ADD_RECITATION:
            return {
                ...state,
                [action.recitation.id]: action.recitation,
            }
        case RECEIVE_RECITATIONS:
            return {
                ...state,
                ...action.recitations,
            }
        case DELETE_RECITATION:
            let remaining = state.filter((id) => action.id !== id)
            return {
                ...remaining
            }
        default: 
            return state
    }
}