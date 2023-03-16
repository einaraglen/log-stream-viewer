import { DndContext, DragOverlay } from "@dnd-kit/core";
import React from "react";
import { useSignalContext } from "../../context/signal_context";
import BrowserList from "./browser/list";
import Selectable from "./browser/selectable";
import SelectedList from "./selected/list";

const Explorer = () => {
  const { onDragEnd, onDragStart, active } = useSignalContext();

  return (
    <DndContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className="flex">
        <div className="w-1/2">
          <BrowserList />
        </div>
        <div className="w-1/2">
          <SelectedList />
        </div>
      </div>
      <DragOverlay style={{ width: "auto"}}>
          {active ? (
            <div className="flex flex-shrink">
              <div className="rounded-md bg-white/10 flex flex-shrink justify-start items-center p-1">
                <Selectable signal={active} />
              </div>
            </div>
          ) : null}
        </DragOverlay>
    </DndContext>
  );
};

export default Explorer;
