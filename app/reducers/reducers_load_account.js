import axios from 'axios'
import store from '../store'

const LOAD_ACCOUNT = 'LOAD_ACCOUNT'

export const loadAccount = (account) => ({
    type: LOAD_ACCOUNT, account
})

export const loadUserAccountInfo = () => dispatch => {
    console.log("loading acct and checking state: ", store.getState())
    if (store.getState().login.currentUser.email) {
        axios.get ('/api/accounts')
        .then(res=>res.data)
        .then (account => {
            console.log("got account from server", account)
            dispatch(loadAccount(account))
        })
    } else {
        dispatch(loadAccount(null))
    }
}

const defaultState = {
    user: {},
    messages: []
}

export default (state = defaultState, action ) => {
    switch (action.type) {
        case LOAD_ACCOUNT: 
            return action.account;
        default: return state;
    }
}