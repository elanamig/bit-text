import React, {Component} from 'react'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Paper from 'material-ui/Paper'
import {Container, List, Subheader } from 'semantic-ui-react';
import {loadUserAccountInfo} from '../reducers/reducers_load_account'

class AccountView extends Component {
    constructor (props) {
        super (props);
    }

    componentDidMount () {
        this.props.loadUserInfo();
    }

    render () {
        const style = {
            width: 650,
            margin: 'auto',
            textAlign: 'center',
        };

        const containerStyle = {
            padding: '4em'
        }
        if (this.props.currentUser && this.props.currentUser.email) {
            console.log("right before account view renter", this.props);
            return <Container style={containerStyle}>
                        <Paper style={style} zDepth={3}>
                            <List >
                                {
                                    this.props.messages.map (messageObj => {
                                        <ListItem  
            
                                            primaryText={messageObj.payee?`${messageObj.id}. To: ${messageObj.payee.fullName} (${messageObj.payee.phone})`:'No transaction created for this message'}
                                            initiallyOpen={false}
                                            primaryTogglesNestedList={true}
                                            nestedItems={
                                                messageObj.Transactions.map(trans => {
                                                    let mainText = trans.paymentType?`${trans.status}. $${trans.amount} sent via ${trans.paymentType.platform}.  Transaction id: ${trans.id}`:
                                                    `${trans.status}. $${trans.amount} sent via [invalid payment type].  Transaction id: ${trans.id}`
                
                                                    mainText = `${mainText} (Original message: ${messageObj.body})`
                                                
                                                    return <ListItem key={`trans-${trans.id}`} secondaryText={mainText} />
                                                })
                                            }
                                        />
                                    })
                                }
                            </List>
                        </Paper>
                    </Container>
        }
        else {
            return <Container style={containerStyle}>
            <Paper style={style} zDepth={3}>
                Please, log in to view account information
            </Paper>
        </Container>
        }
    }
}

const mapState = state => ({
    currentUser: state.login?state.login.currentUser:{},
    messages: state.account? state.account.messages: [],
    user: state.account?state.account.user : {}
})

const mapDispatch = dispatch => ({
    loadUserInfo: () => dispatch(loadUserAccountInfo())
})

export default withRouter (connect (mapState, mapDispatch) (AccountView))