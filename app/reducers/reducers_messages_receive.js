import axios from 'axios';
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';

export const fetchMessages = (messages) => ({
    type: RECEIVE_MESSAGE,
    messages
})
export const deleteMessage = (message) => ({
    type: DELETE_MESSAGE,
    message
})
export const fetchAllMessages = () => dispatch => {
    axios.get('/api/messages')
    .then(res => res.data) 
    .then(msgs => dispatch(fetchMessages(msgs)))
}
export const deleteSingleMessage = (id) => dispatch => {
    console.log(id, 'id')
    axios.delete(`/api/messages/${id}`)
    .then(() => dispatch(deleteMessage))
}
export default function(state = [], action) {
    switch(action.type) {
        case RECEIVE_MESSAGE:
        return [
            ...action.messages
        ]
        case DELETE_MESSAGE:
        return state.filter(msg => msg.id !== action.message.id)
        default: 
        return state
    }
}

