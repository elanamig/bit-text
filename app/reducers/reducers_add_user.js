import axios from 'axios';


export const ADD_USER = 'ADD_USER';
export const FETCH_USERS = 'FETCH_USERS';
export const DELETE_USER = 'DELETE_USER';


export const addUser = (user) => ({
    type: ADD_USER,
    user
})

export const fetchUsers = (users) => ({
    type: FETCH_USERS,
    users
})

export const deleteUser = (user) => ({
    type: DELETE_USER,
    user
})

export function fetchAllUsers() {
    return function thunk(dispatch) {
        return axios.get('/api/users')
        .then(res => res.data)
        .then(users => {
            const action = fetchUsers(users)
            dispatch(action)
        })
    }
}


export function postUser(user) {
    console.log(user)
    return function thunk(dispatch) {
        return axios.post('/api/users', user)
        .then(res => res.data)
        .then(newUser => {
            const action = addUser(newUser)
            dispatch(action)
        })
    }
}

export function removeUser(user) {
    return function thunk(dispatch) {
        return axios.delete(`/api/users/${user.id}`, {user})
        .then(data => {
            const action = deleteUser(user)
            dispatch(action)
        })
    }
}


export default function createUser(state=[], action) {
    switch(action.type) {
        case ADD_USER:
        return  [...state, ...action.user]
        case FETCH_USERS:
        return [...state]
        default: 
        return state
    }
}