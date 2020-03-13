import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Home from '../components/home';

const RootRouter: React.FC<any> = function () {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default RootRouter;
