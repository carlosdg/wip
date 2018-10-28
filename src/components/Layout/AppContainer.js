import React from "react";

const AppContainer = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      maxHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}
  >
    {children}
  </div>
);

export default AppContainer;
