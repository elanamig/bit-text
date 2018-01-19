
import { combineReducers } from 'redux'
import ReceiveMessages from './reducers_messages_receive'
import SendMessages from './reducers_messages_send'
import AddUser from './reducers_add_user'
import LoginUser from './reducers_login_user'
import {reducer as formReducer} from 'redux-form';
const rootReducer = combineReducers({
  received: ReceiveMessages,
  sent: SendMessages,
  users: AddUser,
  login: LoginUser,
  form: formReducer,
});
export default rootReducer

