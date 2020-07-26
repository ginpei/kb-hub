import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { groupPath } from "../../models/Group";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";
import { groupUserPath } from "../../models/GroupUser";

export const GroupViewPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();

  return (
    <BasicLayout title={group.name}>
      <h1>{group.name}</h1>
      <p>
        <Link to={groupPath("index")}>Back</Link>
        {" | "}
        <Link to={groupPath("edit", group)}>Edit</Link>
        {" | "}
        <Link to={groupUserPath(group, "manage")}>Manage users</Link>
      </p>
    </BasicLayout>
  );
});
