import React from 'react';
import { Route, Redirect } from "react-router-dom";

import isConnected from './isConnected';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isConnected() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/qrcode", state: { from: props.location } }} />
      )
    }
  />
);

export default PrivateRoute;