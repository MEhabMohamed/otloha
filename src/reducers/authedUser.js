import { SET_AUTHED_USER, SIGN_OUT } from '../actions/authedUsers'

export default function authedUser (state=null, action) {
    switch (action.type) {
        case SET_AUTHED_USER:
            return [action.id, action.date]
        case SIGN_OUT:
            return null
        default:
            return state
    }
}