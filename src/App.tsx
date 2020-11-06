import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import routes from './routes/index'

function AppRouter() {
  return (
    <Router>
      {routes.map(route => <Route key={route.name} {...route}/>)}
    </Router>
  );
}

export default AppRouter;