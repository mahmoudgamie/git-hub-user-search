import * as React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import ViewUser from "./components/View-user";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="header">
        <div className="title">
          <h1>Git Hub Search</h1>
        </div>
      </div>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route exact path="/view-user/:username" component={ViewUser} />
        <Redirect to="/home" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
