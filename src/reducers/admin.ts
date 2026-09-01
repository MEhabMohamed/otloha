import { ADD_ADMIN, DELETE_ADMIN, RECEIVE_ADMINS } from "../actions/admin";

export default function admins(state: any = {}, action: any): any {
  switch (action.type) {
    case ADD_ADMIN:
      return {
        ...state,
        [action.admin.id]: action.admin,
      };
    case RECEIVE_ADMINS:
      return {
        ...state,
        ...action.admins,
      };
    case DELETE_ADMIN:
      return Object.fromEntries(
        Object.entries(state).filter((e: any) => e[0] !== action.id)
      );
    default:
      return state;
  }
}
