import { getInitialData } from "../helpers/savers"
import { receiveAdmins } from "./admin"
import { receiveRecitations } from "./recitation"
import { receiveTajweed } from "./tajweed"
import { receiveUsers } from "./user"

export default function handleInitialData () {
    return (dispatch) => {
        return getInitialData()
            .then(({ recitations, users, admins,
                students, teachers, tajweed,
                levels, lessons
              }) => {
            dispatch(receiveRecitations(recitations));
            dispatch(receiveUsers(users));
            dispatch(receiveAdmins(admins));
            dispatch(receiveTajweed(tajweed));
            localStorage.setItem("users", JSON.stringify({
                ...users
            }));
            localStorage.setItem("teachers", JSON.stringify({
                ...teachers
            }));
            localStorage.setItem("students", JSON.stringify({
                ...students
            }));
            localStorage.setItem("admins", JSON.stringify({
                ...admins
            }));
            localStorage.setItem("recitations", JSON.stringify({
                ...recitations
            }));
            localStorage.setItem("tajweed", JSON.stringify({
                ...tajweed
            }));
            localStorage.setItem("levels", JSON.stringify({
                ...levels
            }));
            localStorage.setItem("lessons", JSON.stringify({
                ...lessons
            }));
        })
    }
}