import React, {Component} from 'react';
import { connect } from 'react-redux';
class MessageInbox extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        console.log(this.props.received)
        return (
            <div>Hello</div>
        )
    }
}
const mapStateToProps = ({received}) => ({
    received
})
export default connect(mapStateToProps)(MessageInbox)
