import { saveBlocks, savePasses, savePics, saveStudent, saveTeacher } from "../helpers/savers"

export const ADD_USER = 'ADD_USER'
export const RECEIVE_USERS = 'RECEIVE_USERS'
export const EDIT_PASSWORD = 'EDIT_PASSWORD'
export const EDIT_PIC = 'EDIT_PIC'
export const RECEIVE_TEACHERS = 'RECEIVE_TEACHERS'
export const RECEIVE_STUDENTS = 'RECEIVE_STUDENTS'
export const ADD_BLOCK = 'ADD_BLOCK'

function addUser(user) {
    return {
        type: ADD_USER,
        user
    }
}

export function handleAddTeacher(id, name, password, country, description, email, gender, avatar, due, lang, bDate) {
    return (dispatch) => {
        return saveTeacher ({
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
        .then((u) => dispatch(addUser(u)))
    }
} 

export function handleAddStudent(id, name, password, country, description, email, gender, avatar, narration, lang, bDate) {
    return (dispatch) => {
        return saveStudent ({
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
        .then((u) => dispatch(addUser(u)))
    }
} 

export function receiveUsers(users) {
    return {
        type: RECEIVE_USERS,
        users
    }
}

function editPassword(id , password) {
    return {
        type: EDIT_PASSWORD,
        id,
        password
    }
}

export function handleEditPassword(id, password) {
    return (dispatch) => {
        return savePasses({
            id,
            password
        }).then(() => dispatch(editPassword(id, password)))
    }
}

function editPic(id , pic) {
    return {
        type: EDIT_PIC,
        id,
        pic
    }
}

export function handleEditPic(id, pic) {
    return (dispatch) => {
        return savePics({
            id,
            pic
        }).then(() => dispatch(editPic(id, pic)))
    }
}

function addBlock(id , authed) {
    return {
        type: ADD_BLOCK,
        id,
        authed
    }
}

export function handleAddBlock(id, authed) {
    return (dispatch) => {
        return saveBlocks({
            id,
            authed
        }).then(() => dispatch(addBlock(id, authed)))
    }
}