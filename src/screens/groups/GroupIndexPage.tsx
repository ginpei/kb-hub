import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { groupPath } from "../../models/Group";

export const GroupIndexPage: React.FC = () => {
  return (
    <BasicLayout title="Groups">
      <h1>Groups</h1>
      <p>
        <Link to={groupPath("new")}>Create a new group</Link>
      </p>
    </BasicLayout>
  );
};
