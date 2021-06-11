import React from 'react';
// import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// const Home = lazy(() => import('../views/Home'));
// import Home from '../views/Home';
// const Task = lazy(() => import('../views/Task'));

import PrivateRoute from '../utils/privateRoute';
import Home from '../views/Home';
import Task from '../views/Task';
import QrCode from '../views/QrCode';


export default function Routes() {
    return (
        <BrowserRouter>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
                <Switch>
                    <PrivateRoute path="/" exact component={Home}/> 
                    {/* <Route path="/" exact component={Home} /> */}
                    <PrivateRoute path="/task" exact component={Task} />
                    <PrivateRoute path="/task/:id" exact component={Task} />
                    <Route path="/qrcode" exact component={QrCode} />
                </Switch>
            {/* </Suspense> */}
        </BrowserRouter>
    )
}