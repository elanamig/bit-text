import axios from 'axios';
const RECEIVE_SENT_MESSAGE = 'RECEIVE_SENT_MESSAGE';
const DELETE_SENT_MESSAGE = 'DELETE_SENT_MESSAGE';

export const fetchSentMessages = (messages) => ({
    type: RECEIVE_SENT_MESSAGE,
    messages
})
export const deleteSentMessage = (messageId) => ({
    type: DELETE_SENT_MESSAGE,
    messageId
})
export const fetchAllSentMessages = () => dispatch => {
    axios.get('/api/messages/?payee=false')
    .then(res => res.data) 
    .then(msgs => {
        console.log("got messages", msgs)
        dispatch(fetchSentMessages(msgs))
    })
}
export const deleteSingleSentMessage = (id) => dispatch => {
    console.log(id, 'id')
    axios.put(`/api/messages/${id}`,{display:false, payee:true})
    .then(msg => {
        dispatch(deleteSentMessage(msg?id:msg))
    })
    .catch(console.log)
}

export default function(state = [], action) {
    switch(action.type) {
        case RECEIVE_SENT_MESSAGE:
        console.log(action.messages)
        return [
            ...action.messages
        ]
        case DELETE_SENT_MESSAGE:
        return state.filter(msg => msg.id !== action.messageId)
        default: 
        return state
    }
}

