import { combineReducers } from 'redux';
import recitations from './recitation';
import users from './user';
import authedUser from './authedUser';
import admins from './admin';
import tajweed from './tajweed';

export default combineReducers({
  recitations,
  users,
  authedUser,
  admins,
  tajweed
});
