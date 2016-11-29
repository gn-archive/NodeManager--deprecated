import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App/app';
import MainNav from './Nav/containers/MainNav'
import NodesList from './Nodes/containers/NodesList'
import NodeNew from './Nodes/containers/NodeNew';
import NodeShowPage from './Nodes/containers/NodeShowPage';
import NodeSysinfo from './Nodes/containers/NodeSysinfo';
import UserSettings from './UserSettings/components/UserSettings';
import {checkAuthIfNeeded} from './Auth/actions/check_auth';
import SignIn from './Auth/containers/sign_in';
import SignOut from './Auth/containers/sign_out';

import {SET_REDIRECT_ON_AUTH} from './Auth/actions/types'
import {fetchNodes} from './Nodes/actions/nodes_actions'
import {mqttConnect} from './Mqtt/actions/mqtt_actions'

export default function(store) {
    function setRedirect(path) {
        store.dispatch({ type: SET_REDIRECT_ON_AUTH, payload: path })
    }

    function authenticate (nextState, replaceState) {
        const authed = store.getState().auth.authenticated;
        if ( !authed ) {
            setRedirect(nextState.location.pathname);
            replaceState({
                pathname: '/sign_in'
            });
        }
    }

    function check_auth(nextState, replaceState, callback) {
        store.dispatch(checkAuthIfNeeded())
        .then(() => {
            const authed = store.getState().auth.authenticated;
            if (authed) {
                store.dispatch(fetchNodes())
                .then(() => store.dispatch(mqttConnect()) )
            }
        })
        .then(() => {
            callback();
        });
    }

	return(
	    <Route path="/" component={App} onEnter={check_auth}>
	        <IndexRoute component={MainNav} onEnter={authenticate}/>
            <Route path="nodes" component={NodesList} onEnter={authenticate}/>
	        <Route path="nodes/new" component={NodeNew} onEnter={authenticate}/>
	        <Route path="nodes/:node_id" component={NodeShowPage} onEnter={authenticate}/>
            <Route path="nodes/:node_id/sysinfo" component={NodeSysinfo} onEnter={authenticate}/>
            <Route path="settings" component={UserSettings} onEnter={authenticate} />
            <Route path='sign_in' component={SignIn} />
            <Route path='sign_out' component={SignOut} />
	    </Route>
    )
};
