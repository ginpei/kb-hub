import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import "./middleware/firebase";
import { HomePage } from "./screens/HomePage";
import { LoginPage } from "./screens/LoginPage";
import { NotFoundScreen } from "./screens/NotFoundScreen";

const appHistory = createBrowserHistory();

const App: React.FC = () => {
  return (
    <Router history={appHistory}>
      <Switch>
        <Route exact={true} path="/" component={HomePage} />
        <Route exact={true} path="/login" component={LoginPage} />
        <Route component={NotFoundScreen} />
      </Switch>
    </Router>
  );
};

export default App;
