import { ADD_RECITATION , RECEIVE_RECITATIONS , EVALUATE_RECITATION } from "../actions/recitation"

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
        case EVALUATE_RECITATION:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    evaluatedAt: Date.now(),
                    status: action.status,
                    teacher: {
                        name: action.name,
                    },
                    report: action.report
                }
            }
        default: 
            return state
    }
}