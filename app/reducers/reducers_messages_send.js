export const SEND_MESSAGE = 'SEND_MESSAGE';

export const sendMessage = (msg) => ({
    type: SEND_MESSAGE,
    msg
})

export default function(state=[], action) {
    switch(action.type) {
        case SEND_MESSAGE:
        return [...state, ...action.msg]
        default: 
        return state
    }
   
}