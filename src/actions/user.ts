import { deleteUser, saveBlocks, savePasses, savePics, saveStudent, saveTeacher, saveTeacherEvaluation, saveUnblocks, saveUserRatings } from "../helpers/savers";

export const ADD_USER = 'ADD_USER';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const EDIT_PASSWORD = 'EDIT_PASSWORD';
export const EDIT_PIC = 'EDIT_PIC';
export const RECEIVE_TEACHERS = 'RECEIVE_TEACHERS';
export const RECEIVE_STUDENTS = 'RECEIVE_STUDENTS';
export const ADD_BLOCK = 'ADD_BLOCK';
export const REMOVE_BLOCK = 'REMOVE_BLOCK';
export const ADD_USER_RATING = 'ADD_USER_RATING';
export const ADD_TEACHER_EVALUATION = 'ADD_TEACHER_EVALUATION';
export const DELETE_USER = 'DELETE_USER';

function addUser(user: any) {
  return {
    type: ADD_USER,
    user
  };
}

export function handleAddTeacher(
  id: string,
  name: string,
  password: any,
  country: string,
  description: string,
  email: string,
  gender: string,
  avatar: string,
  due: any,
  lang: string,
  bDate: string
) {
  return (dispatch: any) => {
    return saveTeacher({
      id,
      name,
      gender,
      email,
      avatar,
      password,
      country,
      description,
      due,
      lang,
      bDate
    })
    .then((u: any) => dispatch(addUser(u)));
  };
}

export function handleAddStudent(
  id: string,
  name: string,
  password: any,
  country: string,
  description: string,
  email: string,
  gender: string,
  avatar: string,
  narration: string,
  lang: string,
  bDate: string
) {
  return (dispatch: any) => {
    return saveStudent({
      id,
      name,
      gender,
      email,
      avatar,
      password,
      country,
      description,
      narration,
      lang,
      bDate
    })
    .then((u: any) => dispatch(addUser(u)));
  };
}

export function receiveUsers(users: any) {
  return {
    type: RECEIVE_USERS,
    users
  };
}

function addUserRating(raterId: string, ratedId: string, rating: number) {
  return {
    type: ADD_USER_RATING,
    raterId,
    ratedId,
    rating
  };
}

export function handleAddUserRating(raterId: string, ratedId: string, rating: number) {
  return (dispatch: any) => {
    return saveUserRatings({
      raterId,
      ratedId,
      rating
    }).then(() => dispatch(addUserRating(raterId, ratedId, rating)));
  };
}

function editPassword(id: string, password: any) {
  return {
    type: EDIT_PASSWORD,
    id,
    password
  };
}

export function handleEditPassword(id: string, password: any) {
  return (dispatch: any) => {
    return savePasses({
      id,
      password
    }).then(() => dispatch(editPassword(id, password)));
  };
}

function editPic(id: string, pic: string) {
  return {
    type: EDIT_PIC,
    id,
    pic
  };
}

export function handleEditPic(id: string, pic: string) {
  return (dispatch: any) => {
    return savePics({
      id,
      pic
    }).then(() => dispatch(editPic(id, pic)));
  };
}

function addBlock(id: string, authed: string) {
  return {
    type: ADD_BLOCK,
    id,
    authed
  };
}

export function handleAddBlock(id: string, authed: string) {
  return (dispatch: any) => {
    return saveBlocks({
      id,
      authed
    }).then(() => dispatch(addBlock(id, authed)));
  };
}

function Unblock(id: string, authed: string) {
  return {
    type: REMOVE_BLOCK,
    id,
    authed
  };
}

export function handleUnblock(id: string, authed: string) {
  return (dispatch: any) => {
    return saveUnblocks({
      id,
      authed
    }).then(() => dispatch(Unblock(id, authed)));
  };
}

function addTeacherEvaluation(id: string, status: string) {
  return {
    type: ADD_TEACHER_EVALUATION,
    id,
    status
  };
}

export function handleTeacherEvaluation(id: string, status: string) {
  return (dispatch: any) => {
    return saveTeacherEvaluation({
      id,
      status
    }).then(() => dispatch(addTeacherEvaluation(id, status)));
  };
}

function removeUser(id: string) {
  return {
    type: DELETE_USER,
    id
  };
}

export function handleDeleteUser(id: string) {
  return (dispatch: any) => {
    return deleteUser(id).then(() => dispatch(removeUser(id)));
  };
}
