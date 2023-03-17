import React from "react";
import { createRoot } from "react-dom/client";
import Graph from "./components/graph/graph";
import SocketContextProvider from "./context/socket_context";
import Explorer from "./components/explorer/explorer";
import "./index.css";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useSignalContext } from "./context/signal_context";
import Selectable from "./components/explorer/browser/selectable";

const App = () => {
  const { onDragEnd, onDragStart, active } = useSignalContext();

  return (
    <SocketContextProvider>
      <DndContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Graph />
        <Explorer />
        <DragOverlay style={{ width: "auto" }}>
          {active ? (
            <div className="flex flex-shrink">
              <div className="rounded-md bg-black/30 shadow-lg flex flex-shrink justify-start items-center py-0.5">
                <Selectable signal={active} />
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </SocketContextProvider>
  );
};

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<App />);
