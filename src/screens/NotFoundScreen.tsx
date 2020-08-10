import React from "react";
import { BasicLayout } from "../share/composites/BasicLayout";

export const NotFoundScreen: React.FC = () => {
  console.log(`# not found`);
  return (
    <BasicLayout title="Not found">
      <h1>Not found</h1>
    </BasicLayout>
  );
};
