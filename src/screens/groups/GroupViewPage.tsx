import React from "react";
import { Link, useParams } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { groupPath } from "../../models/Group";

export const GroupViewPage: React.FC = () => {
  const { id } = useParams();

  return (
    <BasicLayout title={`Group ${id}`}>
      <h1>Group {id}</h1>
      <p>
        <Link to={groupPath("index")}>Back</Link>
        {" | "}
        <Link to={groupPath("edit", id)}>Edit</Link>
      </p>
    </BasicLayout>
  );
};
