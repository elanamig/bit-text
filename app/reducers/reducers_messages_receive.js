const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

export const receiveMessage = (msg) => ({
    type: RECEIVE_MESSAGE,
    msg
})


export default function(state = [], action) {
    switch(action.type) {
        case RECEIVE_MESSAGE:
        return [
            ...state, action.msg
        ]
        default: 
        return state
    }
}

