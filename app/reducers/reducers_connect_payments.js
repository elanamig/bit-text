import axios from 'axios';


//PaypalStatusState 
const arePaymentsAdded = {
    paypal: false,
    stripe: false
}
//Action Type
const ADD_PAYPAL = 'ADD_PAYPAL';
const ADD_STRIPE = 'ADD_STRIPE';
//Action Creator
const addPaypal = (addPaypal) => ({
    type: ADD_PAYPAL,
    addPaypal
})
const addStripe = (addStripe) => ({
    type: ADD_STRIPE,
    addStripe
})
//Thunk
export const addPaymentTypetoAccount = ({authkey, password, isDefault, platform}, history) => dispatch => {
    axios.post('/api/payments', {authkey, platform, isDefault})
    .then(paymentAdded => {
        console.log(paymentAdded, 'back from payments api')
        if(paymentAdded.data) {
            platform === 'PAYPAL' ? dispatch(addPaypal(true)) : dispatch(addStripe(true))
        } else {
            console.log('platform', platform)
            platform === 'PAYPAL' ? dispatch(addPaypal(false)) : dispatch(addStripe(false))
        }
        history.push('/')
    })

}
//Reducers
export default (state=arePaymentsAdded, action) => {
    switch(action.type) {
        case ADD_PAYPAL:
        return {
            ...arePaymentsAdded, paypal: action.addPaypal
        }
        case ADD_STRIPE: 
        console.log('at stripe yo')
        return {
            ...arePaymentsAdded, stripe: action.addStripe
        }
        default: return state
    }
}
