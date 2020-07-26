import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { groupPath } from "../../models/Group";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";

export const GroupViewPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();

  return (
    <BasicLayout title={group.name}>
      <h1>{group.name}</h1>
      <p>
        <Link to={groupPath("index")}>Back</Link>
        {" | "}
        <Link to={groupPath("edit", group)}>Edit</Link>
      </p>
    </BasicLayout>
  );
});
