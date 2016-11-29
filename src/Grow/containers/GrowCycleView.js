import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Moment from 'react-moment';
import _ from 'lodash'
import { createGrowCycle, fetchGrowCycle } from '../actions/grow_cycle_actions';


class GrowCycleView extends Component {

    componentWillMount() {
        this.props.fetchGrowCycle(this.props.node_id)
    }
    
  render() {
    if (this.props.grow_cycle) {
        return (
            <div>
                ID: {this.props.grow_cycle.id}<br/>
                Starting on {this.props.grow_cycle.start_at}
            </div>
        );
    } else {
        return <div>Loading...</div>;
    }
  }
}


function mapStateToProps (state) {
    return { grow_cycle: state.grow_cycle.data}
}

export default connect(mapStateToProps, { createGrowCycle, fetchGrowCycle })(GrowCycleView);