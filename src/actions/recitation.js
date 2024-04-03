import { saveRecitations } from "../helpers/savers"

export const ADD_RECITATION = 'ADD_RECITATION'
export const RECEIVE_RECITATIONS = 'RECEIVE_RECITATIONS'
export const DELETE_RECITATION = 'DELETE_RECITATION'

function addRecitation (recitation , authed) {
    return {
        type: ADD_RECITATION,
        recitation,
        authed
    }
}

export function handleAddRecitation (verse, narration, playback, authed) {
    return (dispatch) => {
        return saveRecitations({
            verse,
            narration,
            playback,
            authed
        })
        .then((r) => dispatch(addRecitation(r, authed)))
    }
}

export function receiveRecitations(recitations) {
    return {
        type: RECEIVE_RECITATIONS,
        recitations
    }
}

export function deleteRecitation(id) {
    return {
        type: DELETE_RECITATION,
        id
    }
}