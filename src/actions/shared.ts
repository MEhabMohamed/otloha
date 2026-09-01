import { getInitialData, getSessionUser } from "../helpers/savers";
import { receiveAdmins } from "./admin";
import { receiveRecitations } from "./recitation";
import { receiveTajweed } from "./tajweed";
import { receiveUsers } from "./user";
import { receiveAuthedUser } from "./authedUsers";

export default function handleInitialData() {
  return (dispatch: any) => {
    return Promise.all([getInitialData(), getSessionUser()])
      .then(([data, authedId]: any) => {
        dispatch(receiveRecitations(data.recitations));
        dispatch(receiveUsers(data.users));
        dispatch(receiveAdmins(data.admins));
        dispatch(receiveTajweed(data.tajweed));
        if (authedId) {
          dispatch(receiveAuthedUser(authedId));
        }
      });
  };
}
