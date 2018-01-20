import React, {Component} from 'react';
import { connect } from 'react-redux';
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
          

        console.log(this.props.received)
        return (
            <div>
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
                            primaryText={messageObj.payee?`${messageObj.id}. To: ${messageObj.payee.fullName} (${messageObj.payee.phone})`:'No transaction created for this message'}
                            initiallyOpen={false}
                            primaryTogglesNestedList={true}
                            nestedItems={
                                messageObj.Transactions.map(trans => 
                                    <ListItem key={`trans-${trans.id}`} 
                                    primaryText={trans.paymentType?`${trans.id}.  ${trans.status}. $${trans.amount} sent via ${trans.paymentType.platform}`:
                                    `${trans.id}.  ${trans.status}. $${trans.amount} sent via [invalid payment type]`}
                                    secondaryText={`Original message: ${messageObj.body}`}
                                    />
                                )
                            }
                        />
                        <Divider inset={true} />
                        </div>
                       
                    )
                }):<Subheader> No messages to display </Subheader>}
              </List>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageInbox)
