import React, {Component} from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import {fetchAllSentMessages, deleteSingleSentMessage} from '../reducers/reducers_messages_send'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper'

class MessageInbox extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        this.props.getMessages()
    }
    render() {
        const iconButtonElement = (
            <IconButton
              touch={true}
              tooltip="more"
              tooltipPosition="bottom-left"
            >
              <MoreVertIcon color={grey400} />
            </IconButton>
          );
          const paperStyle = {
            background: 'white',
            margin: '3em'
        }

        console.log(this.props.received)
        return (
            <Paper style={paperStyle} zDepth={3}>
              <List>
                <Subheader>Sent Messages</Subheader>
                
                {this.props.sent.length?this.props.sent.map(messageObj => {
                    const rightIconMenu = (
                        <IconMenu iconButtonElement={iconButtonElement}>
                          {/*<MenuItem>Reply</MenuItem>
                          <MenuItem>Forward</MenuItem>
                        <MenuItem onClick={() => this.props.viewDetails(messageObj.id)}>Details</MenuItem>*/}
                          
                          <MenuItem onClick={() => this.props.deleteMessage(messageObj.id)}>Delete</MenuItem>
                        </IconMenu>
                      );
                    return (
                        <div key={messageObj.id}>
                        <Divider inset={true} />
                        <ListItem  
                            leftAvatar={<Avatar src="images/kerem-128.jpg" />} 
                            rightIconButton={rightIconMenu}
                            primaryText={messageObj.payee?`${new Date(messageObj.createdAt).toLocaleString()} - To: ${messageObj.payee.fullName} (${messageObj.payee.phone})`:'No transaction created for this message'}
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
                        <Divider inset={true} />
                        </div>
                       
                    )
                }):<Subheader> No messages to display </Subheader>}
              </List>
              </Paper>
        )
    }
}
const mapStateToProps = ({sent}) => ({
    sent
})
const mapDispatchToProps = (dispatch) => ({
    getMessages() {
        dispatch(fetchAllSentMessages())
    },
    deleteMessage(messageId) {
        dispatch(deleteSingleSentMessage(messageId))
    }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessageInbox))