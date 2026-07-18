import { deleteRecitation, saveEvaluations, saveRecitationRatings, saveRecitations } from "../helpers/savers";

export const ADD_RECITATION = 'ADD_RECITATION';
export const RECEIVE_RECITATIONS = 'RECEIVE_RECITATIONS';
export const EVALUATE_RECITATION = 'EVALUATE_RECITATION';
export const ADD_RECITATION_RATING = 'ADD_RATING';
export const DELETE_RECITATION = 'DELETE_RECITATION';

function addRecitation(recitation: any, authed: string) {
  return {
    type: ADD_RECITATION,
    recitation,
    authed
  };
}

export function handleAddRecitation(verse: any, narration: string, playback: string, authed: string) {
  return (dispatch: any) => {
    return saveRecitations({
      verse,
      narration,
      playback,
      authed
    })
    .then((r: any) => dispatch(addRecitation(r, authed)));
  };
}

export function receiveRecitations(recitations: any) {
  return {
    type: RECEIVE_RECITATIONS,
    recitations
  };
}

function addRecitationRating(raterId: string, ratedId: string, rating: number) {
  return {
    type: ADD_RECITATION_RATING,
    raterId,
    ratedId,
    rating
  };
}

export function handleAddRecitationRating(raterId: string, ratedId: string, rating: number) {
  return (dispatch: any) => {
    return saveRecitationRatings({
      raterId,
      ratedId,
      rating
    }).then(() => dispatch(addRecitationRating(raterId, ratedId, rating)));
  };
}

function evaluateRecitation(id: string, authed: string, status: string, name: string, avatar: string, report: string) {
  return {
    type: EVALUATE_RECITATION,
    id,
    authed,
    status,
    name,
    avatar,
    report
  };
}

export function handleEvaluateRecitation(id: string, authed: string, status: string, name: string, avatar: string, report: string) {
  return (dispatch: any) => {
    return saveEvaluations({
      id,
      authed,
      status,
      name,
      avatar,
      report
    })
    .then(() => dispatch(evaluateRecitation(id, authed, status, name, avatar, report)));
  };
}

function removeRecitation(id: string) {
  return {
    type: DELETE_RECITATION,
    id
  };
}

export function handleDeleteRecitation(id: string) {
  return (dispatch: any) => {
    return deleteRecitation(id).then(() => dispatch(removeRecitation(id)));
  };
}
