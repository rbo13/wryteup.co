import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {AuthHome} from './home';
import {Profile} from './profile';

const AuthenticatedApp = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <AuthHome />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
};


export {AuthenticatedApp};


