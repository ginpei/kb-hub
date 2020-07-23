import React, { useMemo } from "react";
import { BasicLayout } from "../composites/BasicLayout";

export const ErrorScreen: React.FC<{ error: unknown }> = ({ error }) => {
  const message = useMemo(() => {
    // eslint-disable-next-line no-console
    console.error(error);

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    if (typeof error === "object" && error && "message" in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (error as any).message;
    }

    return "Unknown error";
  }, [error]);

  return (
    <BasicLayout title="Error">
      <h1>Error</h1>
      <p className="error">{message}</p>
    </BasicLayout>
  );
};
