import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import {
  createKnowledge,
  Knowledge,
  knowledgePath,
} from "../../models/Knowledge";

const dummyKnowledges: Knowledge[] = [
  createKnowledge({ id: "1", title: "One" }),
  createKnowledge({ id: "2", title: "Two" }),
];

export const KBIndexPage: React.FC = () => {
  return (
    <BasicLayout title="Knowledge base index">
      <h1>Knowledge base index</h1>
      <p>
        <Link to={knowledgePath("new")}>New knowledge</Link>
      </p>
      {dummyKnowledges.map((knowledge) => (
        <KBItem knowledge={knowledge} />
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
