import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../composites/BasicLayout";

export const HomePage: React.FC = () => {
  return (
    <BasicLayout>
      <h1>Knowledge Base Hub</h1>
      <ul>
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
    </BasicLayout>
  );
};
