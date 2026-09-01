import { ADD_RECITATION, RECEIVE_RECITATIONS, EVALUATE_RECITATION, ADD_RECITATION_RATING, DELETE_RECITATION } from "../actions/recitation";

export default function recitations(state: any = {}, action: any): any {
  switch (action.type) {
    case DELETE_RECITATION:
      return Object.fromEntries(
        Object.entries(state).filter((e: any) => e[0] !== action.id)
      );
    case ADD_RECITATION:
      return {
        ...state,
        [action.recitation.id]: action.recitation,
      };
    case RECEIVE_RECITATIONS:
      return {
        ...state,
        ...action.recitations,
      };
    case ADD_RECITATION_RATING:
      return {
        ...state,
        [action.ratedId]: {
          ...state[action.ratedId],
          raters: state[action.ratedId].raters.concat([{ rater: action.raterId, rating: action.rating }]),
        }
      };
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
      };
    default:
      return state;
  }
}
