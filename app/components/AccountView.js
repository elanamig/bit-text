import React, {Component} from 'react'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Paper from 'material-ui/Paper'
import {Container } from 'semantic-ui-react';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
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
                        <div>{this.props.user.fullName}</div>
                        <div>{this.props.user.email}</div>
                        <div>{this.props.user.phone}</div>
                            <List >
                            <Subheader>Connected Payment Platforms</Subheader>
                                {
                                    this.props.paymentTypes.map (payType => 
                                        {
                                            const isDefault = payType.isDefault?'(default)':''
                                        return <ListItem key={payType.id} 
                                            primaryText={`${payType.platform} ${isDefault}`}
                                            initiallyOpen={false}
                                            primaryTogglesNestedList={true}
                                            nestedItems={[<ListItem key={payType.id} secondaryText={`Client ID: ${payType.authkey}`} />]  }
                                        />
                                        }
                                    )
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
    paymentTypes: state.account? state.account.paymentTypes: [],
    user: state.account?state.account.user : {}
})

const mapDispatch = dispatch => ({
    loadUserInfo: () => dispatch(loadUserAccountInfo())
})

export default withRouter (connect (mapState, mapDispatch) (AccountView))