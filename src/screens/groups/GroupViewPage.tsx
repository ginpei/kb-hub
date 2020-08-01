import firebase from "firebase/app";
import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { groupPath } from "../../models/Group";
import { useLatestKnowledges, knowledgePath } from "../../models/Knowledge";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";

const fs = firebase.firestore();

export const GroupViewPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();
  const [knowledges, knowledgesReady, knowledgesError] = useLatestKnowledges(
    fs,
    group
  );

  if (!knowledgesReady) {
    return <LoadingScreen />;
  }

  if (knowledgesError) {
    return <ErrorScreen error={knowledgesError} />;
  }

  return (
    <BasicLayout title={group.name}>
      <h1>{group.name}</h1>
      <p>
        <Link to={groupPath("index")}>Back</Link>
        {" | "}
        <Link to={groupPath("edit", group)}>Edit</Link>
        {" | "}
        <Link to={groupPath("users", group)}>Users</Link>
      </p>
      <ul>
        {knowledges.map((knowledge) => (
          <li key={knowledge.id}>
            <Link to={knowledgePath("view", group, knowledge)}>
              {knowledge.title}
            </Link>
          </li>
        ))}
      </ul>
    </BasicLayout>
  );
});
