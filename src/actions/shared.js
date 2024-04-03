import { getInitialData } from "../helpers/savers"
import { receiveAdmins } from "./admin"
import { receiveRecitations } from "./recitation"
import { receiveUsers } from "./user"

export default function handleInitialData () {
    return (dispatch) => {
        return getInitialData()
            .then(({ recitations , users , admins , teachers , students }) => {
            dispatch(receiveRecitations(recitations));
            dispatch(receiveUsers(users));
            dispatch(receiveAdmins(admins));
        })
    }
}