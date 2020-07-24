import React from "react";
import styles from "./LoadingScreen.module.scss";

export const LoadingScreen: React.FC = () => {
  return (
    <div className="LoadingScreen">
      <div className={styles.header}></div>
    </div>
  );
};
