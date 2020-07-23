import firebase from "firebase/app";
import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import {
  Knowledge,
  knowledgePath,
  useLatestKnowledges,
} from "../../models/Knowledge";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";

const fs = firebase.firestore();

export const KBIndexPage: React.FC = () => {
  const [knowledges, knowledgesReady, knowledgesError] = useLatestKnowledges(
    fs
  );

  if (!knowledgesReady) {
    return <LoadingScreen />;
  }

  if (knowledgesError) {
    return <ErrorScreen error={knowledgesError} />;
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
