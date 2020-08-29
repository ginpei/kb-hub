import firebase from "firebase/app";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { jcn } from "../../misc/misc";
import { useCurrentUser } from "../../models/User";
import { ErrorScreen } from "../../screens/ErrorScreen";
import { LoadingScreen } from "../../screens/LoadingScreen";
import styles from "./BasicLayout.module.scss";

export type BasicLayoutProps = {
  title?: string;
};

const auth = firebase.auth();
const fs = firebase.firestore();

export const BasicLayout: React.FC<BasicLayoutProps> = ({
  children,
  title,
}) => {
  const [user, userReady, userError] = useCurrentUser(auth, fs);

  useEffect(() => {
    const baseTitle = "Knowledge Base Hub";
    const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
    document.title = fullTitle;
  }, [title]);

  if (!userReady) {
    return <LoadingScreen />;
  }

  if (userError) {
    return <ErrorScreen error={userError} />;
  }

  return (
    <div className="BasicLayout">
      <div className={styles.header}>
        <div className={jcn(styles.headerInner, "container")}>
          <Link to="/">Knowledge Base Hub</Link>
          <div className="menu">
            {user ? (
              <Link to="/my">{user.name || "(No name)"}</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </div>
      </div>
      <div className={jcn(styles.main, "container")}>{children}</div>
      <div className={styles.footer}>
        <div className="footerInner container">Footer</div>
      </div>
    </div>
  );
};
