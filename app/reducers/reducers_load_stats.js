import axios from 'axios'
import store from '../store'

const LOAD_STATS = 'LOAD_STATS'

export const loadStats = (stats) => ({
    type: LOAD_STATS, stats
})

export const loadTransactions = () => dispatch => {
    console.log("loading transactions and checking state: ", store.getState())
    if (store.getState().login.currentUser.email) {
        axios.get ('/api/stats')
        .then(res=>res.data)
        .then (stats => {
            console.log("got stats from server", stats)
            dispatch(loadStats(stats))
        })
    } else {
        dispatch(loadStats([]))
    }
}

const defaultState = {
    stats: []
}

export default (state = defaultState, action ) => {
    switch (action.type) {
        case LOAD_STATS: 
            return action.stats;
        default: return state;
    }
}