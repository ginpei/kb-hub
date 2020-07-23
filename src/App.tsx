import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./middleware/firebase";
import { HomePage } from "./screens/HomePage";
import { LoginPage } from "./screens/LoginPage";
import { NotFoundScreen } from "./screens/NotFoundScreen";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/" component={HomePage} />
        <Route exact={true} path="/login" component={LoginPage} />
        <Route component={NotFoundScreen} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
