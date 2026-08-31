import { getInitialData } from "../helpers/savers";
import { receiveAdmins } from "./admin";
import { setAuthedUser } from "./authedUsers";
import { receiveRecitations } from "./recitation";
import { receiveTajweed } from "./tajweed";
import { receiveUsers } from "./user";

export default function handleInitialData () {
    return (dispatch) => {
        return getInitialData()
            .then(({ recitations, users, admins, tajweed }) => {
            dispatch(receiveRecitations(recitations));
            dispatch(receiveUsers(users));
            dispatch(receiveAdmins(admins));
            dispatch(receiveTajweed(tajweed));

            if (typeof window !== 'undefined' && window.sessionStorage) {
                const authed = window.sessionStorage.getItem("authedUser");
                if (authed) {
                    try {
                        const parsed = JSON.parse(authed);
                        const id = Array.isArray(parsed) ? parsed[0] : parsed;
                        if (id) {
                            dispatch(setAuthedUser(id));
                        }
                    } catch (e) {
                        console.error("Error parsing authedUser from sessionStorage:", e);
                    }
                }
            }
        });
    };
}