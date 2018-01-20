import axios from 'axios';
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';

export const fetchMessages = (messages) => ({
    type: RECEIVE_MESSAGE,
    messages
})
export const deleteMessage = (messageId) => ({
    type: DELETE_MESSAGE,
    messageId
})
export const fetchAllMessages = () => dispatch => {
    axios.get('/api/messages/?payee=true')
    .then(res => res.data) 
    .then(msgs => {
        console.log("got messages", msgs)
        dispatch(fetchMessages(msgs))
    })
}
export const deleteSingleMessage = (id) => dispatch => {
    console.log(id, 'id')
    axios.put(`/api/messages/${id}`,{display:false, payee:false})
    .then(msg => {
        dispatch(deleteMessage(msg?id:msg))
    })
    .catch(console.log)
}

export default function(state = [], action) {
    switch(action.type) {
        case RECEIVE_MESSAGE:
        console.log(action.messages)
        return [
            ...action.messages
        ]
        case DELETE_MESSAGE:
        return state.filter(msg => msg.id !== action.messageId)
        default: 
        return state
    }
}

