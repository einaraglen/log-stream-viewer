import React from "react";
import { createRoot } from "react-dom/client";
import Graph from "./components/graph/graph";
import SocketContextProvider from "./context/socket_context";
import Explorer from "./components/explorer/explorer";
import "./index.css";

const App = () => {
  return (
    <SocketContextProvider>
      <Graph />
      <Explorer />
    </SocketContextProvider>
  );
};

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<App />);
