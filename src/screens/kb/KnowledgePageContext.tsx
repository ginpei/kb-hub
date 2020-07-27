import firebase from "firebase/app";
import React, { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../models/CurrentUserProvider";
import { useGroup } from "../../models/Group";
import {
  createKnowledge,
  Knowledge,
  useKnowledge,
} from "../../models/Knowledge";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { NotFoundScreen } from "../NotFoundScreen";

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
    const user = useCurrentUserContext();
    const [group, groupReady, groupError] = useGroup(fs, user, id);
    const [knowledge, knowledgeReady, knowledgeError] = useKnowledge(
      fs,
      group,
      id
    );

    if (!groupReady || !knowledgeReady) {
      return <LoadingScreen />;
    }

    const error = groupError || knowledgeError;
    if (error) {
      return <ErrorScreen error={error} />;
    }

    if (!group || !knowledge) {
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
