import React from "react";
import { Route, Switch } from "react-router-dom";
import { GroupEditPage } from "./screens/groups/GroupEditPage";
import { GroupIndexPage } from "./screens/groups/GroupIndexPage";
import { GroupViewPage } from "./screens/groups/GroupViewPage";
import { NewGroupPage } from "./screens/groups/NewGroupPage";
import { HomePage } from "./screens/HomePage";
import { KBEditPage } from "./screens/kb/KBEditPage";
import { KBIndexPage } from "./screens/kb/KBIndexPage";
import { KBNewPage } from "./screens/kb/KBNewPage";
import { KBViewPage } from "./screens/kb/KBViewPage";
import { LoginScreen } from "./screens/LoginScreen";
import { MyPage } from "./screens/MyPage";
import { NotFoundScreen } from "./screens/NotFoundScreen";
import { GroupUserManagementPage } from "./screens/groups/GroupUserManagementPage.tsx";

export const Routings: React.FC = () => (
  <Switch>
    <Route exact={true} path="/" component={HomePage} />
    <Route exact={true} path="/groups" component={GroupIndexPage} />
    <Route exact={true} path="/groups/new" component={NewGroupPage} />
    <Route exact={true} path="/groups/:id" component={GroupViewPage} />
    <Route exact={true} path="/groups/:id/edit" component={GroupEditPage} />
    <Route
      exact={true}
      path="/groups/:id/users/manage"
      component={GroupUserManagementPage}
    />
    <Route exact={true} path="/kb" component={KBIndexPage} />
    <Route exact={true} path="/kb/new" component={KBNewPage} />
    <Route exact={true} path="/kb/:id" component={KBViewPage} />
    <Route exact={true} path="/kb/:id/edit" component={KBEditPage} />
    <Route exact={true} path="/login" component={LoginScreen} />
    <Route exact={true} path="/my" component={MyPage} />
    <Route component={NotFoundScreen} />
  </Switch>
);
