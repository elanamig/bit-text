import React, {Component} from 'react';
import { connect } from 'react-redux';
import {fetchAllMessages, deleteSingleMessage} from '../reducers/reducers_messages_receive'
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
                <Subheader>Received Messages</Subheader>
                
                {this.props.received.length?this.props.received.map(messageObj => {
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
                            primaryText={messageObj.payer?`${messageObj.id}.  From: ${messageObj.payer.fullName} (${messageObj.payer.phone})`:'No transaction created for this message'}
                            initiallyOpen={false}
                            primaryTogglesNestedList={true}
                            nestedItems={
                                messageObj.Transactions.filter(trans=>trans.paymentType).map(trans => 
                                    <ListItem key={`trans-${trans.id}`} 
                                              primaryText={`${trans.id}.  ${trans.status}. $${trans.amount} received via ${trans.paymentType.platform}`}
                                              
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
const mapStateToProps = ({received}) => ({
    received
})
const mapDispatchToProps = (dispatch) => ({
    getMessages() {
        dispatch(fetchAllMessages())
    },
    deleteMessage(messageId) {
        dispatch(deleteSingleMessage(messageId))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageInbox)
