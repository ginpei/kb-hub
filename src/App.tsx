import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./middleware/firebase";
import { HomePage } from "./screens/HomePage";
import { KBEditPage } from "./screens/kb/KBEditPage";
import { KBIndexPage } from "./screens/kb/KBIndexPage";
import { KBNewPage } from "./screens/kb/KBNewPage";
import { KBViewPage } from "./screens/kb/KBViewPage";
import { LoginScreen } from "./screens/LoginScreen";
import { NotFoundScreen } from "./screens/NotFoundScreen";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/" component={HomePage} />
        <Route exact={true} path="/kb" component={KBIndexPage} />
        <Route exact={true} path="/kb/new" component={KBNewPage} />
        <Route exact={true} path="/kb/:id" component={KBViewPage} />
        <Route exact={true} path="/kb/:id/edit" component={KBEditPage} />
        <Route exact={true} path="/login" component={LoginScreen} />
        <Route component={NotFoundScreen} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
