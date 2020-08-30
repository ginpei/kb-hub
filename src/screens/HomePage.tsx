import firebase from "firebase/app";
import React from "react";
import { Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCurrentUserContext } from "../models/CurrentUserProvider";
import { Group, groupPath } from "../models/Group";
import { useUserGroups } from "../models/GroupUser";
import { knowledgePath, useLatestKnowledges } from "../models/Knowledge";
import { useCurrentUser } from "../models/User";
import { BasicLayout } from "../share/composites/BasicLayout";

const auth = firebase.auth();
const fs = firebase.firestore();

export const HomePage: React.FC = () => {
  const user = useCurrentUserContext();

  return (
    <BasicLayout>
      <h1>Knowledge Base Hub</h1>
      <ul>
        <li>
          <Link to={groupPath("index")}>Groups</Link>
        </li>
        <li>
          <Link to="/kb">Knowledge base index</Link>
        </li>
        <li>
          <Link to="/my">My Page</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
      {user && <RecentKnowledgeSection />}
    </BasicLayout>
  );
};

const RecentKnowledgeSection: React.FC = () => {
  const [user, userReady, userError] = useCurrentUser(auth, fs);
  const [groups, groupsReady, groupsError] = useUserGroups(fs, user);

  const h2 = <h2>Recent Knowledge</h2>;

  if (!userReady || !groupsReady) {
    return (
      <div>
        {h2}
        <Spinner animation="grow" size="sm" role="status" />
      </div>
    );
  }

  const error = userError || groupsError;
  if (error) {
    return (
      <div>
        {h2}
        <Alert variant="danger">Error: {error.message}</Alert>
      </div>
    );
  }

  return (
    <div className="RecentKnowledgeSection">
      {h2}
      {groups.map((group) => (
        <RecentGroupKnowledges group={group} key={group.id} />
      ))}
    </div>
  );
};

const RecentGroupKnowledges: React.FC<{ group: Group }> = ({ group }) => {
  const [knowledges, knowledgesReady, knowledgesError] = useLatestKnowledges(
    fs,
    group
  );

  if (!knowledgesReady) {
    return <Spinner animation="grow" size="sm" role="status" />;
  }

  if (knowledgesError) {
    return <Alert variant="danger">Error: {knowledgesError.message}</Alert>;
  }

  return (
    <section>
      <h3>
        <Link to={groupPath("view", group)}>{group.name}</Link>
      </h3>
      <ul className="RecentGroupKnowledges">
        {knowledges.map((knowledge) => (
          <li key={knowledge.id}>
            <Link to={knowledgePath("view", group, knowledge)}>
              {knowledge.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
