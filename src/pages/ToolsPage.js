import React from "react";
import NavigationPanel from "../components/Navbar/NavigationPanel";
import ToolsList from "../components/Tools/ToolsList/ToolsList";

const ToolsPage = () => {
  return (
    <div>
      <NavigationPanel />
      <ToolsList />
    </div>
  );
};

export default ToolsPage;
