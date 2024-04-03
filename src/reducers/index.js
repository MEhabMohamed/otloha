import { combineReducers } from 'redux';
import recitations from './recitation';
import users from './user';
import authedUser from './authedUser';
import admins from './admin';

export default combineReducers({
    recitations,
    users,
    authedUser,
    admins
})