import { saveEvaluations, saveRecitations } from "../helpers/savers"

export const ADD_RECITATION = 'ADD_RECITATION'
export const RECEIVE_RECITATIONS = 'RECEIVE_RECITATIONS'
export const EVALUATE_RECITATION = 'EVALUATE_RECITATION'

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

function evaluateRecitation(id, authed, status, name, report) {
    return {
        type: EVALUATE_RECITATION,
        id,
        authed,
        status,
        name,
        report
    }
}

export function handleEvaluateRecitation(id, authed, status, name, report) {
    return (dispatch) => {
        return saveEvaluations({
            id,
            authed,
            status,
            name,
            report
        })
        .then(() => dispatch(evaluateRecitation(id, authed, status, name, report)))
    }
}