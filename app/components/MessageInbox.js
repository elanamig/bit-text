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
                <Subheader>Today</Subheader>
                {this.props.received.map(messageObj => {
                    const rightIconMenu = (
                        <IconMenu iconButtonElement={iconButtonElement}>
                          <MenuItem>Reply</MenuItem>
                          <MenuItem>Forward</MenuItem>
                          <MenuItem onClick={() => this.props.deleteMessage(messageObj.id)}>Delete</MenuItem>
                        </IconMenu>
                      );
                    return (
                        <div key={messageObj.id}>
                        <Divider inset={true} />
                        <ListItem  leftAvatar={<Avatar src="images/kerem-128.jpg" />} rightIconButton={rightIconMenu}
                          primaryText={messageObj.payer.fullName}
                          secondaryText={
                            <p>
                              <span style={{color: darkBlack}}>{messageObj.payer.phone}</span><br />
                              {messageObj.body}
                            </p>
                          }
                          secondaryTextLines={2}
                        />
                        <Divider inset={true} />
                        </div>
                       
                    )
                })}
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
    deleteMessage() {
        dispatch(deleteSingleMessage())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageInbox)
