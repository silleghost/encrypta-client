import React from "react";
import ReactDOM from "react-dom";
// import Header from "./components/Header";

const App = () => {
  return (
    <div>
      {/* <Header /> */}
      <h1>Password manager eee</h1>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
