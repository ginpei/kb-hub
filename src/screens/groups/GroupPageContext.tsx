import firebase from "firebase/app";
import React, { createContext, useContext } from "react";
import { useParams } from "../../misc/react-router-dom";
import { createGroup, Group, useGroup } from "../../models/Group";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { NotFoundScreen } from "../NotFoundScreen";
import { provideLoggedInUser } from "../provideLoggedInUser";

const fs = firebase.firestore();

const GroupPageContext = createContext(createGroup());

/**
 * Wrap component with `<GroupContext.Provider>`.
 * You can receive the group specified by `id` path param over context.
 *
 * If there are problems, like not found, this shows the error automatically.
 * @example
 * export const KBPage = provideGroup(() => {
 *   const group = useGroupContext();
 *
 *   return (
 *     <BasicLayout>
 *       id: {group.id}
 *     </BasicLayout>
 *   );
 * });
 */
export function provideGroupPage(Component: React.FC): React.FC {
  return provideLoggedInUser(({ user }) => {
    const params = useParams();
    const groupId = params.groupId || params.id;
    if (!groupId) {
      return <NotFoundScreen />;
    }
    const [group, groupReady, groupError] = useGroup(fs, user, groupId);

    if (!groupReady) {
      return <LoadingScreen />;
    }

    if (groupError) {
      return <ErrorScreen error={groupError} />;
    }

    if (!group) {
      return <NotFoundScreen />;
    }

    return (
      <GroupPageContext.Provider value={group}>
        <Component />
      </GroupPageContext.Provider>
    );
  });
}

export function useGroupPageContext(): Group {
  return useContext(GroupPageContext);
}
