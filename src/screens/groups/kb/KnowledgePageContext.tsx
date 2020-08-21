import firebase from "firebase/app";
import React, { createContext, useContext } from "react";
import { useParams } from "../../../misc/react-router-dom";
import {
  createKnowledge,
  Knowledge,
  useKnowledge,
} from "../../../models/Knowledge";
import { ErrorScreen } from "../../ErrorScreen";
import { LoadingScreen } from "../../LoadingScreen";
import { NotFoundScreen } from "../../NotFoundScreen";
import { provideGroupPage, useGroupPageContext } from "../GroupPageContext";

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
  return provideGroupPage(() => {
    const { id } = useParams();
    if (!id) {
      return <NotFoundScreen />;
    }
    const group = useGroupPageContext();
    const [knowledge, knowledgeReady, knowledgeError] = useKnowledge(
      fs,
      group,
      id
    );

    if (!knowledgeReady) {
      return <LoadingScreen />;
    }

    if (knowledgeError) {
      return <ErrorScreen error={knowledgeError} />;
    }

    if (!group || !knowledge) {
      return <NotFoundScreen />;
    }

    return (
      <KnowledgePageContext.Provider value={knowledge}>
        <Component />
      </KnowledgePageContext.Provider>
    );
  });
}

export function useKnowledgePageContext(): Knowledge {
  return useContext(KnowledgePageContext);
}
