import firebase from "firebase/app";
import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { useUser } from "../../misc/firebaseHooks";
import {
  Knowledge,
  knowledgePath,
  useLatestKnowledges,
} from "../../models/Knowledge";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { LoginScreen } from "../LoginScreen";

const auth = firebase.auth();
const fs = firebase.firestore();

export const KBIndexPage: React.FC = () => {
  const [user, userReady, userError] = useUser(auth);
  const [knowledges, knowledgesReady, knowledgesError] = useLatestKnowledges(
    fs,
    user
  );

  if (!userReady || !knowledgesReady) {
    return <LoadingScreen />;
  }

  if (!user) {
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
        <Link to={knowledgePath("new")}>New knowledge</Link>
      </p>
      {knowledges.map((knowledge) => (
        <KBItem key={knowledge.id} knowledge={knowledge} />
      ))}
    </BasicLayout>
  );
};

const KBItem: React.FC<{ knowledge: Knowledge }> = ({ knowledge }) => {
  return (
    <div className="KBItem">
      <Link to={knowledgePath("view", knowledge)}>{knowledge.title}</Link>
    </div>
  );
};
