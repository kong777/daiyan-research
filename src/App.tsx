import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './views/Home'
import Queue from './views/Queue'
import Random from './views/Random'
import Login from './views/Login'
import Menu from './views/Menu'
import Exam from './views/Exam'
import Review from './views/Review'
import Diffcult from './views/Diffcult'

function AppRouter() {
  return (
    <Router>
        <Menu></Menu>
        <Route exact path="/" component={Home}></Route>
        <Route path="/queue" component={Queue} />
        <Route path="/login" component={Login} />
        <Route path="/random" component={Random} />
        <Route path="/exam" component={Exam} />
        <Route path="/review" component={Review} />
        <Route path="/diffcult" component={Diffcult} />
    </Router>
  );
}

export default AppRouter;