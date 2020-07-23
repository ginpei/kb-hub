import firebase from "firebase/app";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { knowledgePath, useKnowledge } from "../../models/Knowledge";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { NotFoundScreen } from "../NotFoundScreen";

const fs = firebase.firestore();

export const KBViewPage: React.FC = () => {
  const { id } = useParams();

  const [knowledge, knowledgeReady, knowledgeError] = useKnowledge(fs, id);

  if (!knowledgeReady) {
    return <LoadingScreen />;
  }

  if (knowledgeError) {
    return <ErrorScreen error={knowledgeError} />;
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
      <p>{knowledge.content}</p>
    </BasicLayout>
  );
};
