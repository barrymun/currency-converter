import React from 'react';
import {connect} from 'react-redux';
import {Router} from 'react-router-dom';

import {history} from '../helpers';
import visualizerPublicRoutes from '../Converter/routes/public.routes';

import './App.css';

class App extends React.Component {
    render() {
        return (
            <Router history={history}>
                {visualizerPublicRoutes(this.props)}
            </Router>
        );
    }
}

const c = connect()(App);
export {c as App};
