import React, {Component} from 'react';
import { connect } from 'react-redux';
import {fetchInbox} from '../store'
class MessageInbox extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount () {
        this.props.loadInbox();
    }

    render() {
        console.log(this.props.received)
        return (
            <table>
            {
                this.props.received.map (msg => 
                    <tr key={msg.id}>
                        <td>{msg.sender}</td><td>{msg.recipient}</td><td>{msg.body}</td>
                    </tr>
                )
            }
            </table>
        )
    }
}
const mapStateToProps = ({received}) => ({
    received
})

const mapDispatchToPRops = dispatch => {
    loadInbox: () => dispatch(fetchInbox())
}
export default connect(mapStateToProps)(MessageInbox)
