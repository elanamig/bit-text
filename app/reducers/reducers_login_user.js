import axios from 'axios';

const LOGIN_USER = 'LOGIN_USER';
const LOGOUT_USER = 'LOGOUT_USER';
const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';

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

export function loginUser(user, history) {
    return function thunk(dispatch) {
        return axios.post('/auth/local/login', user)
        .then(res => res.data)
        .then(data => {
            const action = login(user);
            dispatch(action)
            history.push('/')
        })
    }
}
export function logoutUser() {
    return function thunk(dispatch) {
        return axios.post('/auth/local/logout')
        .then(() => {
            dispatch(logout())
        })
    }
}
export default function LoginReducer(state = {}, action) {
    switch(action.type) {
        case LOGIN_USER: 
        return {
            ...state, activeUser: action.user
        }
        case LOGOUT_USER:
        return {
            ...state, currentUser: {}
        }
        case FETCH_CURRENT_USER:
        return {
            ...state, currentUser: action.user
        }
        default: 
        return state
    }
}

export const fetchCurrentUser = () => dispatch => {
    axios.get('/auth/local/me')
      .then(res => {
          console.log(res.data, 'this is the data')
          dispatch(setCurrentUser(res.data))
        })
      .catch(err => console.error('Fetching current user failed', err));
  };
