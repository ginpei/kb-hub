import firebase from "firebase/app";
import React, { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  createKnowledge,
  Knowledge,
  useKnowledge,
} from "../../models/Knowledge";
import { useCurrentUser } from "../../models/User";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { LoginScreen } from "../LoginScreen";
import { NotFoundScreen } from "../NotFoundScreen";

const auth = firebase.auth();
const fs = firebase.firestore();

const KnowledgePageContext = createContext(createKnowledge());

/**
 * Wrap component with `<KnowledgeContext.Provider>`.
 * You can receive the knowledge specified by `id` path param over context.
 *
 * If there are problems, like not found, this shows the error automatically.
 * @example
 * export const KBPage = provideKnowledge(() => {
 *   const knowledge = useKnowledgeContext();
 *
 *   return (
 *     <BasicLayout>
 *       id: {knowledge.id}
 *     </BasicLayout>
 *   );
 * });
 */
export function provideKnowledgePage(Component: React.FC): React.FC {
  return () => {
    const { id } = useParams();
    const [user, userReady, userError] = useCurrentUser(auth, fs);
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
      <KnowledgePageContext.Provider value={knowledge}>
        <Component />
      </KnowledgePageContext.Provider>
    );
  };
}

export function useKnowledgePageContext(): Knowledge {
  return useContext(KnowledgePageContext);
}
