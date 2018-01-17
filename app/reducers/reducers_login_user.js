import axios from 'axios';

const LOGIN_USER = 'LOGIN_USER';
const LOGOUT_USER = 'LOGOUT_USER';
const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';

const login = (user) => ({
    type: LOGIN_USER,
    user
})
const logout = (user) => ({
    type: LOGOUT_USER,
    user
})
const setCurrentUser = (user) => ({
    type: FETCH_CURRENT_USER,
    user
})

export function loginUser(user) {
    return function thunk(dispatch) {
        return axios.put('/auth/local/login', user)
        .then(res => res.data)
        .then(data => {
            console.log(data)
            const action = login(user);
            dispatch(action)
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
            ...state, activeUser: null
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
          console.log(res.data)
          setCurrentUser(res.data)
        })
      .catch(err => console.error('Fetching current user failed', err));
  };