import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {Container } from 'semantic-ui-react'
import {loadTransactions} from '../reducers/reducers_load_stats';

class StatsView extends Component {
    constructor (props) {
        super (props)
    }

    componentDidMount () {
        this.props.loadTransactionData()
    }

    render () {
        if(this.props.stats && this.props.stats.length) {
            return (
                <Container style={{padding: '4em'}}> <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Platform</TableHeaderColumn>
                            <TableHeaderColumn># Transactions</TableHeaderColumn>
                            <TableHeaderColumn># Completed</TableHeaderColumn>
                            <TableHeaderColumn># Sent</TableHeaderColumn>
                            <TableHeaderColumn>$ Sent</TableHeaderColumn>
                            <TableHeaderColumn># Received</TableHeaderColumn>
                            <TableHeaderColumn>$ Received</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                    {
                        this.props.stats.map(stat => 
                            <TableRow key={stat.platform}>
                                <TableRowColumn>{stat.platform}</TableRowColumn>
                                <TableRowColumn>{stat.numTrans}</TableRowColumn>
                                <TableRowColumn>{`${stat.numCompleted}/${stat.numTrans}`}</TableRowColumn>
                                <TableRowColumn>{stat.numSent}</TableRowColumn>
                                <TableRowColumn>{stat.amtSent}</TableRowColumn>
                                <TableRowColumn>{stat.numReceived}</TableRowColumn>
                                <TableRowColumn>{stat.amtReceived}</TableRowColumn>
                            </TableRow>
                        )
                    } 
                    </TableBody>
                </Table> </Container>)
        } else return null;
    }
}

const mapState = state => ({
    stats: state.stats,
    currentUser: state.login.currentUser
})

const mapDispatch = dispatch => ({
    loadTransactionData: () => dispatch (loadTransactions())
})

export default withRouter (connect (mapState, mapDispatch) (StatsView));