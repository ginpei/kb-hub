import React, { useEffect, CSSProperties } from "react";

export const HomePage: React.FC = () => {
  return (
    <BasicLayout>
      <h1>Knowledge Base Hub</h1>
    </BasicLayout>
  );
};

const styles: Record<string, CSSProperties> = {
  header: {
    backgroundColor: "var(--color-theme-bg)",
    color: "var(--color-theme-fg)",
    height: "2rem",
    lineHeight: "2rem",
  },

  main: {
    minHeight: '50vh',
  },

  footer: {
    borderTop: "dashed 1px var(--color-theme-lightBorder)",
    marginTop: "1rem",
    paddingBottom: "4rem",
    paddingTop: "1rem",
  },
}

const BasicLayout: React.FC<{
  title?: string;
}> = ({ children, title }) => {
  useEffect(() => {
    const baseTitle  = "Knowledge Base Hub";
    const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
    document.title = fullTitle;
  }, [title]);

  return (
    <div className="BasicLayout">
      <div className="header" style={styles.header}>
        <div className="headerInner ui-container">
          Knowledge Base Hub
        </div>
      </div>
      <div className="main ui-container" style={styles.main}>{children}</div>
      <div className="footer" style={styles.footer}>
        <div className="footerInner ui-container">
          Footer
        </div>
      </div>
    </div>
  );
};
