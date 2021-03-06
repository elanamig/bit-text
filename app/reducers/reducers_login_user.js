import axios from 'axios';

const LOGIN_USER = 'LOGIN_USER';
const LOGOUT_USER = 'LOGOUT_USER';
const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
const LOGIN_ERR = 'LOGIN_ERR';

const login = (user) => ({
    type: LOGIN_USER,
    user
})
const logout = () => ({
    type: LOGOUT_USER
    
})
const setCurrentUser = (user) => ({
    type: FETCH_CURRENT_USER,
    user
})

const loginErr = () => ({
    type: LOGIN_ERR
})

export function loginUser(user, history, method) {
    return function thunk(dispatch) {
        return axios.post(`/auth/local/${method}`, user)
        .then(res => res.data)
        .then(data => {
            if (typeof data === 'string' && data.indexOf('Invalid') >= 0) {
                dispatch (loginErr())
            } else {
                console.log(data, 'user object got back this')
                const action = login(data);
                dispatch(action)
                data.validationCode ? history.push('/validation') : history.push('/')
                
            }
            
        })
    }
}
export function logoutUser() {
    return function thunk(dispatch) {
        return axios.post(`/auth/local/logout`)
        .then(() => {
            dispatch(logout())
        })
    }
}

const defaultState = {
    currentUser: {},
    loginErr: false
}
export default function LoginReducer(state = defaultState, action) {
    switch(action.type) {
        case LOGIN_USER: 
            return {
                ...state, currentUser: action.user, loginErr: false
            }
        case LOGOUT_USER:
            return {
                ...state, currentUser: {}, loginErr: false
            }
        case FETCH_CURRENT_USER:
            return {
                ...state, currentUser: action.user, loginErr: false
            }

        case LOGIN_ERR:
            return {
                ...state, loginErr: true
            }


        default: 
        return state
    }
}

export const fetchCurrentUser = () => dispatch => {
    axios.get('/auth/local/me')
      .then(res => {
          console.log(res.data, 'this is the data')
          dispatch(setCurrentUser(res.data.email?res.data:{}))
        })
      .catch(err => console.error('Fetching current user failed', err));
  };
