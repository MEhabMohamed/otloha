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

function addLevel(level) {
    return {
        type: ADD_LEVEL,
        level
    }
}

export function handleAddLevel(name, color, value) {
    return (dispatch) => {
        return saveLevels({
            name,
            color,
            value
        })
        .then((level) => dispatch(addLevel(level)))
    }
}

export function receiveTajweed(tajweed) {
    return {
        type: RECEIVE_TAJWEED,
        tajweed
    }
}

function editLevel(id, name, color, value) {
    return {
        type: EDIT_LEVEL,
        id,
        name,
        color,
        value
    }
}

export function handleEditLevel(id, name, color, value) {
    return (dispatch) => {
        return saveEditLevels({
            id,
            name,
            color,
            value
        }).then(() => dispatch(editLevel(id, name, color, value)))
    }
}

function deleteLevel(id) {
    return {
        type: DELETE_LEVEL,
        id,
    }
}

export function handleDeleteLevel(id) {
    return (dispatch) => {
        return deleteLevels({
            id
        }).then(() => dispatch(deleteLevel(id)))
    }
}

function addLesson(lesson) {
    return {
        type: ADD_LESSON,
        lesson
    }
}

export function handleAddLesson(title, content, level, parentLesson) {
    return (dispatch) => {
        return saveLessons({
            title,
            content,
            level,
            parentLesson
        })
        .then((lesson) => dispatch(addLesson(lesson)))
    }
}

function editLesson(id, title, content, level, parentLesson) {
    return {
        type: EDIT_LESSON,
        id,
        title,
        content,
        level,
        parentLesson
    }
}

export function handleEditLesson(id, title, content, level, parentLesson) {
    return (dispatch) => {
        return saveEditLessons({
            id,
            title,
            content,
            level,
            parentLesson
        }).then(() => dispatch(editLesson(id, title, content, level, parentLesson)))
    }
}

function deleteLesson(id) {
    return {
        type: DELETE_LESSON,
        id,
    }
}

export function handleDeleteLesson(id) {
    return (dispatch) => {
        return deleteLessons({
            id
        }).then(() => dispatch(deleteLesson(id)))
    }
}