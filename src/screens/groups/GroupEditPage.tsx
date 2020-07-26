import React from "react";
import { Link, useParams } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { groupPath } from "../../models/Group";

export const GroupEditPage: React.FC = () => {
  const { id } = useParams();

  return (
    <BasicLayout title={`Edit ${id}`}>
      <h1>Edit</h1>
      <p>
        <Link to={groupPath("view", id)}>Back</Link>
      </p>
    </BasicLayout>
  );
};
