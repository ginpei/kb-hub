import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../composites/BasicLayout";

export const HomePage: React.FC = () => {
  return (
    <BasicLayout>
      <h1>Knowledge Base Hub</h1>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </BasicLayout>
  );
};
