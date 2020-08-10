import firebase from "firebase/app";
import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../../share/composites/BasicLayout";
import {
  Knowledge,
  knowledgePath,
  useLatestKnowledges,
} from "../../../models/Knowledge";
import { useCurrentUser } from "../../../models/User";
import { ErrorScreen } from "../../ErrorScreen";
import { LoadingScreen } from "../../LoadingScreen";
import { LoginScreen } from "../../LoginScreen";
import { provideGroupPage, useGroupPageContext } from "../GroupPageContext";
import { Group } from "../../../models/Group";

const auth = firebase.auth();
const fs = firebase.firestore();

export const KBIndexPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();
  const [user, userReady, userError] = useCurrentUser(auth, fs);
  const [knowledges, knowledgesReady, knowledgesError] = useLatestKnowledges(
    fs,
    group
  );

  if (!userReady || !knowledgesReady) {
    return <LoadingScreen />;
  }

  if (!user) {
    // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    return <LoginScreen />;
  }

  const error = userError || knowledgesError;
  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <BasicLayout title="Knowledge base index">
      <h1>Knowledge base index</h1>
      <p>
        <Link to={knowledgePath("new", group)}>New knowledge</Link>
      </p>
      {knowledges.map((knowledge) => (
        <KBItem group={group} key={knowledge.id} knowledge={knowledge} />
      ))}
    </BasicLayout>
  );
});

const KBItem: React.FC<{ group: Group; knowledge: Knowledge }> = ({
  group,
  knowledge,
}) => {
  return (
    <div className="KBItem">
      <Link to={knowledgePath("view", group, knowledge)}>
        {knowledge.title}
      </Link>
    </div>
  );
};
