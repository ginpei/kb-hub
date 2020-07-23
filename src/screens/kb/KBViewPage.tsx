import NiceMarkdown from "@ginpei/react-nice-markdown";
import firebase from "firebase/app";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { useUser } from "../../misc/firebaseHooks";
import { knowledgePath, useKnowledge } from "../../models/Knowledge";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { LoginScreen } from "../LoginScreen";
import { NotFoundScreen } from "../NotFoundScreen";

const auth = firebase.auth();
const fs = firebase.firestore();

export const KBViewPage: React.FC = () => {
  const { id } = useParams();
  const [user, userReady, userError] = useUser(auth);
  const [knowledge, knowledgeReady, knowledgeError] = useKnowledge(
    fs,
    user,
    id
  );

  if (!userReady || !knowledgeReady) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  const error = userError || knowledgeError;
  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!knowledge) {
    return <NotFoundScreen />;
  }

  return (
    <BasicLayout title="View">
      <h1>{knowledge.title}</h1>
      <p>
        <Link to={knowledgePath("index")}>Index</Link>
        {" | "}
        <Link to={knowledgePath("edit", knowledge)}>Edit</Link>
      </p>
      <NiceMarkdown content={knowledge.content} />
    </BasicLayout>
  );
};
