import { deleteLessons, deleteLevels, saveEditLessons, saveEditLevels, saveLessons, saveLevels } from "../helpers/savers";

export const ADD_LEVEL = 'ADD_LEVEL';
export const ADD_LESSON = 'ADD_LESSON';
export const EDIT_LEVEL = 'EDIT_LEVEL';
export const EDIT_LESSON = 'EDIT_LESSON';
export const DELETE_LEVEL = 'DELETE_LEVEL';
export const DELETE_LESSON = 'DELETE_LESSON';
export const ADD_EXAMPLE = 'ADD_EXAMPLE';
export const ADD_VIDEO = 'ADD_VIDEO';
export const EDIT_EXAMPLE = 'EDIT_EXAMPLE';
export const EDIT_VIDEO = 'EDIT_VIDEO';
export const DELETE_EXAMPLE = 'DELETE_EXAMPLE';
export const DELETE_VIDEO = 'DELETE_VIDEO';
export const RECEIVE_TAJWEED = 'RECEIVE_TAJWEED';

function addLevel(level: any) {
  return {
    type: ADD_LEVEL,
    level
  };
}

export function handleAddLevel(name: string, color: string, value: string) {
  return (dispatch: any) => {
    return saveLevels({
      name,
      color,
      value
    })
    .then((level: any) => dispatch(addLevel(level)));
  };
}

export function receiveTajweed(tajweed: any) {
  return {
    type: RECEIVE_TAJWEED,
    tajweed
  };
}

function editLevel(id: string, name: string, color: string, value: string) {
  return {
    type: EDIT_LEVEL,
    id,
    name,
    color,
    value
  };
}

export function handleEditLevel(id: string, name: string, color: string, value: string) {
  return (dispatch: any) => {
    return saveEditLevels({
      id,
      name,
      color,
      value
    }).then(() => dispatch(editLevel(id, name, color, value)));
  };
}

function deleteLevel(id: string) {
  return {
    type: DELETE_LEVEL,
    id,
  };
}

export function handleDeleteLevel(id: string) {
  return (dispatch: any) => {
    return deleteLevels({
      id
    }).then(() => dispatch(deleteLevel(id)));
  };
}

function addLesson(lesson: any) {
  return {
    type: ADD_LESSON,
    lesson
  };
}

export function handleAddLesson(title: string, content: string, level: string, parentLesson: string) {
  return (dispatch: any) => {
    return saveLessons({
      title,
      content,
      level,
      parentLesson
    })
    .then((lesson: any) => dispatch(addLesson(lesson)));
  };
}

function editLesson(id: string, title: string, content: string, level: string, parentLesson: string) {
  return {
    type: EDIT_LESSON,
    id,
    title,
    content,
    level,
    parentLesson
  };
}

export function handleEditLesson(id: string, title: string, content: string, level: string, parentLesson: string) {
  return (dispatch: any) => {
    return saveEditLessons({
      id,
      title,
      content,
      level,
      parentLesson
    }).then(() => dispatch(editLesson(id, title, content, level, parentLesson)));
  };
}

function deleteLesson(id: string) {
  return {
    type: DELETE_LESSON,
    id,
  };
}

export function handleDeleteLesson(id: string) {
  return (dispatch: any) => {
    return deleteLessons({
      id
    }).then(() => dispatch(deleteLesson(id)));
  };
}
