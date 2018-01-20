
import { combineReducers } from 'redux'
import ReceiveMessages from './reducers_messages_receive'
import SentMessages from './reducers_messages_send'
import AddUser from './reducers_add_user'
import LoginUser from './reducers_login_user'
import Account from './reducers_load_account'
import {reducer as formReducer} from 'redux-form';
const rootReducer = combineReducers({
  received: ReceiveMessages,
  sent: SentMessages,
  users: AddUser,
  login: LoginUser,
  form: formReducer,
  account: Account
});
export default rootReducer

