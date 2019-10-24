import * as React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import ViewUser from "./components/View-user";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route exact path="/view-user/:username" component={ViewUser} />
        <Redirect to="/home" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
