import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {routes} from "../constants";
import {Root} from '../../Converter'

const visualizerPublicRoutes = thisProps => {
    return (
        <Switch>
            <Route
                exact
                path={routes.ROOT}
                render={props => (
                    <Root
                        {...props}
                        {...thisProps}
                    />
                )}
            />
        </Switch>
    );
};
export default visualizerPublicRoutes;