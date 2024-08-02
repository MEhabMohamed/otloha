import { getInitialData } from "../helpers/savers"
import { receiveAdmins } from "./admin"
import { receiveRecitations } from "./recitation"
import { receiveTajweed } from "./tajweed"
import { receiveUsers } from "./user"

export default function handleInitialData () {
    return (dispatch) => {
        return getInitialData()
            .then(({ recitations, users, admins,
                tajweed
              }) => {
            dispatch(receiveRecitations(recitations));
            dispatch(receiveUsers(users));
            dispatch(receiveAdmins(admins));
            dispatch(receiveTajweed(tajweed));
        })
    }
}