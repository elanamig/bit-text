import React, {Component} from 'react';
import { connect } from 'react-redux';

class SendMessages extends Component {
    render() {
        return (
            <div>
            <h1>Send a Message!</h1>
            <input />

            </div>
           
        )
    }
}

export default connect(null, null)(SendMessages)