import { saveEvaluations, saveRecitationRatings, saveRecitations } from "../helpers/savers"

export const ADD_RECITATION = 'ADD_RECITATION'
export const RECEIVE_RECITATIONS = 'RECEIVE_RECITATIONS'
export const EVALUATE_RECITATION = 'EVALUATE_RECITATION'
export const ADD_RECITATION_RATING = 'ADD_RATING'

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

function addRecitationRating(raterId , ratedId, rating) {
    return {
        type: ADD_RECITATION_RATING,
        raterId,
        ratedId,
        rating
    }
}

export function handleAddRecitationRating(raterId, ratedId, rating) {
    return (dispatch) => {
        return saveRecitationRatings({
            raterId,
            ratedId,
            rating
        }).then(() => dispatch(addRecitationRating(raterId, ratedId, rating)))
    }
}

function evaluateRecitation(id, authed, status, name, avatar, report) {
    return {
        type: EVALUATE_RECITATION,
        id,
        authed,
        status,
        name,
        avatar,
        report
    }
}

export function handleEvaluateRecitation(id, authed, status, name, avatar, report) {
    return (dispatch) => {
        return saveEvaluations({
            id,
            authed,
            status,
            name,
            avatar,
            report
        })
        .then(() => dispatch(evaluateRecitation(id, authed, status, name, avatar, report)))
    }
}