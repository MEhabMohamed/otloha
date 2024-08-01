import { ADD_RECITATION , RECEIVE_RECITATIONS , EVALUATE_RECITATION, ADD_RECITATION_RATING } from "../actions/recitation"

export default function recitations (state={}, action) {
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
        case ADD_RECITATION_RATING:
            return {
                ...state,
                [action.ratedId]: {
                    ...state[action.ratedId],
                    raters: state[action.ratedId].raters.concat([{rater: action.raterId, rating: action.rating}]),
                }
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
                        avatar: action.avatar
                    },
                    report: action.report
                }
            }
        default: 
            return state
    }
}