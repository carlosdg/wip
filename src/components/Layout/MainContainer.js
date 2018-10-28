import React from "react";

const MainContainer = ({ children }) => (
  <main
    style={{
      flexGrow: "1",
      overflowY: "auto"
    }}
  >
    {children}
  </main>
);

export default MainContainer;
