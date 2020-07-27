import firebase from "firebase/app";
import React, { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { createGroup, Group, useGroup } from "../../models/Group";
import { useCurrentUser } from "../../models/User";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { LoginScreen } from "../LoginScreen";
import { NotFoundScreen } from "../NotFoundScreen";

const auth = firebase.auth();
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
  return () => {
    const { id, groupId } = useParams();
    const [user, userReady, userError] = useCurrentUser(auth, fs);
    const [group, groupReady, groupError] = useGroup(fs, user, groupId || id);

    if (!userReady || !groupReady) {
      return <LoadingScreen />;
    }

    if (!user) {
      return <LoginScreen />;
    }

    const error = userError || groupError;
    if (error) {
      return <ErrorScreen error={error} />;
    }

    if (!group) {
      return <NotFoundScreen />;
    }

    return (
      <GroupPageContext.Provider value={group}>
        <Component />
      </GroupPageContext.Provider>
    );
  };
}

export function useGroupPageContext(): Group {
  return useContext(GroupPageContext);
}
