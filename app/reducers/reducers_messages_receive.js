import axios from 'axios';

const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
const GET_INBOX = 'GET_INBOX';

export const receiveMessage = (msg) => ({
    type: RECEIVE_MESSAGE,
    msg
})

export const getInbox = (msgs) => {
    type: GET_INBOX,
    msgs
}

export const fetchInbox = () => {
    axios.get('/api/messages/?type=in')
    .then(messages => {
        console.log('got messages');
        dispatch( gotInbox (messages));
    })
}

export default function(state = [], action) {
    switch(action.type) {
        case RECEIVE_MESSAGE:
            return [
                ...state, action.msg
            ]
        case GET_INBOX: 
            return action.msgs
        default: return state
    }
}

