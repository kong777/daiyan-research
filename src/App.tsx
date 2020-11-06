import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import routes from './routes/index'

function AppRouter() {
  return (
    <Router>
      {routes.map((route, routeIndex) => <Route key={routeIndex} {...route}/>)}
    </Router>
  );
}

export default AppRouter;